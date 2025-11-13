import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params })
    if (!result.success) return res.status(400).json({ message: 'Validation error', details: result.error.issues })
    next()
  }
}