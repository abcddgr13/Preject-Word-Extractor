import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordInput } from "@/components/WordInput";
import { ResultCard } from "@/components/ResultCard";
import { useAnalyzeWord } from "@/hooks/use-analyze";
import type { AnalysisResult } from "@shared/schema";
import { GraduationCap } from "lucide-react";

export default function Home() {
  const { mutate: analyze, isPending } = useAnalyzeWord();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentWord, setCurrentWord] = useState<string>("");

  const handleAnalyze = (word: string) => {
    setCurrentWord(word);
    analyze({ word }, {
      onSuccess: (data) => {
        setResult(data);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden font-thai selection:bg-primary/20">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-100/40 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col items-center min-h-screen">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>โครงงานภาษาไทย มัธยมศึกษาปีที่ 3/9</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 font-display">
            ระบบจำแนก<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ชนิดของคำภาษาไทย</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-thai leading-relaxed">
            เครื่องมือช่วยวิเคราะห์และจำแนกประเภทของคำ เช่น คำมูล คำประสม คำซ้อน และคำซ้ำ 
            พร้อมคำอธิบายหลักภาษาที่เข้าใจง่าย
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="w-full z-10">
          <WordInput onAnalyze={handleAnalyze} isLoading={isPending} />
        </div>

        {/* Results Section */}
        <div className="w-full mt-8">
          <AnimatePresence mode="wait">
            {result && !isPending && (
              <ResultCard key={currentWord} result={result} word={currentWord} />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-auto pt-24 text-center text-slate-400 text-sm font-thai"
        >
          <p>© 2026 ระบบวิเคราะห์คำภาษาไทยเพื่อการศึกษา</p>
        </motion.footer>
      </div>
    </div>
  );
}
