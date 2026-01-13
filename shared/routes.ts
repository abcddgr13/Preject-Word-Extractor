import { z } from 'zod';
import { analyzeRequestSchema, analysisResultSchema } from './schema';

export const api = {
  analyze: {
    method: 'POST' as const,
    path: '/api/analyze',
    input: analyzeRequestSchema,
    responses: {
      200: analysisResultSchema,
      400: z.object({ message: z.string(), field: z.string().optional() }),
      500: z.object({ message: z.string() }),
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
