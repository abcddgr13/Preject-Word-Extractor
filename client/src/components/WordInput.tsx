import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordInputProps {
  onAnalyze: (word: string) => void;
  isLoading: boolean;
}

export function WordInput({ onAnalyze, isLoading }: WordInputProps) {
  const [word, setWord] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      onAnalyze(word.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "relative flex items-center p-2 rounded-2xl transition-all duration-300 bg-white",
          isFocused 
            ? "shadow-2xl shadow-primary/20 ring-4 ring-primary/10 scale-[1.02]" 
            : "shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60"
        )}
      >
        <div className="pl-4 text-muted-foreground">
          <Sparkles className={cn("w-6 h-6 transition-colors duration-300", isFocused ? "text-primary" : "text-slate-300")} />
        </div>
        
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="พิมพ์คำภาษาไทยที่นี่... (เช่น แม่น้ำ, ลูกเสือ)"
          className="w-full px-4 py-4 text-xl md:text-2xl font-medium bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-300 font-thai"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !word.trim()}
          className={cn(
            "flex-shrink-0 px-6 py-3 mr-1 rounded-xl font-bold text-white transition-all duration-300 flex items-center gap-2",
            isLoading || !word.trim()
              ? "bg-slate-200 cursor-not-allowed text-slate-400"
              : "bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">วิเคราะห์...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">ตรวจสอบ</span>
            </>
          )}
        </button>
      </motion.form>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center text-sm text-muted-foreground font-thai"
      >
        ลองพิมพ์คำที่สงสัย ระบบจะช่วยบอกชนิดของคำให้ทันที
      </motion.p>
    </div>
  );
}
