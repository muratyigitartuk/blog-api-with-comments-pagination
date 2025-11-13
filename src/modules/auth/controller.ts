import { Request, Response, NextFunction } from 'express'
import * as svc from './service'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, username, password } = req.body
    const result = await svc.register(email, username, password)
    res.status(201).json(result)
  } catch (e) { next(e) }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body
    const result = await svc.login(email, password)
    res.json(result)
  } catch (e) { next(e) }
}