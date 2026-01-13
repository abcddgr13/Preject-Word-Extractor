import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wordAnalyses = pgTable("word_analyses", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  result: jsonb("result").notNull(), // Store the full analysis object
});

export const insertWordAnalysisSchema = createInsertSchema(wordAnalyses).pick({
  word: true,
  result: true,
});

export type WordAnalysis = typeof wordAnalyses.$inferSelect;
export type InsertWordAnalysis = z.infer<typeof insertWordAnalysisSchema>;

// API Schemas
export const analyzeRequestSchema = z.object({
  word: z.string().min(1, "กรุณากรอกคำที่ต้องการตรวจสอบ"),
});

export const analysisResultSchema = z.object({
  type: z.string(),
  principle: z.string(),
  meaning: z.string(),
  isUnknown: z.boolean(),
  rawOutput: z.string().optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
