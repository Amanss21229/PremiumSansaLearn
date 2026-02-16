import { z } from 'zod';
import { insertModelSchema, models, questions } from './schema';

export const api = {
  models: {
    list: {
      method: 'GET' as const,
      path: '/api/models' as const,
      responses: {
        200: z.array(z.custom<typeof models.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/models/:id' as const,
      responses: {
        200: z.custom<typeof models.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    questions: {
      list: {
        method: 'GET' as const,
        path: '/api/models/:id/questions' as const,
        responses: {
          200: z.array(z.custom<typeof questions.$inferSelect>()),
        },
      },
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
