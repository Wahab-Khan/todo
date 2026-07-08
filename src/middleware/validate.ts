import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

/**
 * Validation middleware factory.
 *
 * Why this pattern:
 * - Keeps route handlers clean (they can assume the input is already shaped correctly)
 * - Allows Zod coercion (e.g. params.id "123" -> 123) before Prisma sees the data
 *
 * Note: we overwrite `req.body/req.params/req.query` with the parsed result so downstream
 * code can rely on normalized types.
 */
export const validate = (schema: ZodType<any>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Override request properties with validated/coerced data
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
