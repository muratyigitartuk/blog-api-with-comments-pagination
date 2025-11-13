import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  const code = err.code || undefined
  const details = err.details || undefined
  res.status(status).json({ message, code, details })
}