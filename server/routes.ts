import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client using Replit AI Integrations env vars
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.analyze.path, async (req, res) => {
    try {
      const input = api.analyze.input.parse(req.body);
      const word = input.word.trim();

      // Construct the exact prompt requested
      const prompt = `
คุณคือระบบวิเคราะห์คำภาษาไทยเชิงวิชาการ
หน้าที่ของคุณคือจำแนกชนิดของคำภาษาไทยอย่างถูกต้องตามหลักภาษา

กรุณาวิเคราะห์คำต่อไปนี้:
1) ระบุชนิดของคำ โดยเลือกชนิดที่เหมาะสมที่สุดเพียงหนึ่งชนิดจาก
   - คำประสม
   - คำซ้อน
   - คำสมาส
   - คำสนธิ
   - คำแผลง
   - หากไม่ใช่ 5 ชนิดข้างต้น ให้ระบุว่าเป็น "คำไทยดั้งเดิม" หรือ "คำยืมจากต่างประเทศ" ตามความเหมาะสม
2) อธิบายหลักเกณฑ์ที่ใช้ในการจำแนกแบบสั้นและชัดเจน (ไม่เกิน 1–2 ประโยค)
3) ให้ความหมายเบื้องต้นของคำในระดับนักเรียน

ข้อกำหนด:
- พยายามจำแนกให้ได้ทุกคำ หากเป็นคำมูลหรือคำพื้นฐานให้ระบุตามหลักภาษาอย่างถูกต้อง
- ห้ามกล่าวถึง AI, ChatGPT หรือเทคโนโลยีใด ๆ
- ใช้ภาษาทางการ เข้าใจง่าย

คำที่ต้องการวิเคราะห์คือ: "${word}"
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1", // Using standard model
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 500,
        temperature: 0.3, // Low temperature for more deterministic/academic results
      });

      const content = completion.choices[0]?.message?.content || "";

      // Parse the response based on expected format
      // Format:
      // ชนิดของคำ: ...
      // หลักการจำแนก: ...
      // ความหมายเบื้องต้น: ...
      // OR "ไม่สามารถจำแนก..."

      let result = {
        type: "",
        principle: "",
        meaning: "",
        isUnknown: false,
        rawOutput: content
      };

      if (content.includes("ไม่สามารถจำแนกชนิดของคำนี้ได้อย่างชัดเจน") || content.includes("ไม่สามารถจำแนกชนิดของคำ") || content.includes("ไม่สามารถจำแนกได้")) {
        result.isUnknown = true;
      } else {
        // Try to extract using more robust regex to handle variations in labels
        const typeMatch = content.match(/(?:ชนิดของคำ|ระบุชนิดของคำ|ประเภทของคำ)[:\s]+(.+)/i);
        const principleMatch = content.match(/(?:หลักการจำแนก|เหตุผล|หลักเกณฑ์)[:\s]+(.+)/i);
        const meaningMatch = content.match(/(?:ความหมายเบื้องต้น|ความหมาย)[:\s]+(.+)/i);

        if (typeMatch && principleMatch && meaningMatch) {
          result.type = typeMatch[1].trim().replace(/^\d+\)\s*/, '');
          result.principle = principleMatch[1].trim().replace(/^\d+\)\s*/, '');
          result.meaning = meaningMatch[1].trim().replace(/^\d+\)\s*/, '');
        } else {
           // Fallback if parsing fails but text is there
           const lines = content.split('\n').filter(l => l.trim().length > 0);
           
           // Heuristic extraction based on keywords
           const findLine = (keywords: string[]) => {
             return lines.find(l => keywords.some(k => l.includes(k)))?.split(/[:：]/)[1]?.trim() || "";
           };

           result.type = findLine(["ชนิดของคำ", "ระบุชนิดของคำ", "ประเภท"]);
           result.principle = findLine(["หลักการจำแนก", "หลักเกณฑ์", "เหตุผล"]);
           result.meaning = findLine(["ความหมายเบื้องต้น", "ความหมาย"]);
           
           if (!result.type || result.type.includes("ไม่สามารถจำแนก")) {
             result.isUnknown = true;
           }
        }
      }

      // Log the analysis (fire and forget or wait)
      await storage.logAnalysis({
        word: word,
        result: result
      });

      res.json(result);

    } catch (err) {
      console.error("Analysis error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล" });
    }
  });

  return httpServer;
}
