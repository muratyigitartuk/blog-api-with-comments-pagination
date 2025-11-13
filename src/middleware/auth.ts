import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'

export interface AuthPayload { userId: number }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload
    ;(req as any).user = { id: payload.userId }
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}