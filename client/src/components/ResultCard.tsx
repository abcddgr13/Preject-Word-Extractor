import { motion } from "framer-motion";
import { BookOpen, Info, HelpCircle } from "lucide-react";
import type { AnalysisResult } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  result: AnalysisResult;
  word: string;
}

export function ResultCard({ result, word }: ResultCardProps) {
  const isUnknown = result.isUnknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full max-w-3xl mx-auto mt-12"
    >
      <div className={cn(
        "relative overflow-hidden rounded-3xl p-8 md:p-10 border transition-all",
        isUnknown 
          ? "bg-amber-50/80 border-amber-100 shadow-xl shadow-amber-500/5" 
          : "bg-white border-white/50 shadow-2xl shadow-primary/10"
      )}>
        {/* Decorative background blob */}
        {!isUnknown && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        )}

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-8 border-b border-dashed border-slate-200 pb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 font-display tracking-tight">
              {word}
            </h2>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium text-sm md:text-base self-start md:self-auto">
              <span>คำที่ตรวจสอบ</span>
            </div>
          </div>

          {isUnknown ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 font-display">ไม่สามารถจำแนกได้ชัดเจน</h3>
              <p className="text-amber-700/80 max-w-md font-thai">
                ระบบไม่สามารถระบุชนิดของคำนี้ได้อย่างมั่นใจ หรือคำนี้อาจมีความหมายกำกวมในบริบทที่แตกต่างกัน
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    ชนิดของคำ
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-display">
                    {result.type}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    ความหมายโดยสังเขป
                  </div>
                  <p className="text-lg text-slate-600 font-thai leading-relaxed">
                    {result.meaning}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4 font-display text-lg">หลักการจำแนก</h4>
                <p className="text-slate-600 font-thai leading-relaxed">
                  {result.principle}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
