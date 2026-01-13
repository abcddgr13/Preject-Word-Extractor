import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeRequest, AnalysisResult } from "@shared/schema";

export function useAnalyzeWord() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeRequest): Promise<AnalysisResult> => {
      // Validate input before sending using the shared schema
      const validated = api.analyze.input.parse(data);
      
      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "เกิดข้อผิดพลาดในการวิเคราะห์");
      }

      const result = await res.json();
      // Validate response using the shared schema
      return api.analyze.responses[200].parse(result);
    },
    onError: (error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
