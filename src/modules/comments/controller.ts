import { Request, Response, NextFunction } from 'express'
import * as svc from './service'
import { getPagination } from '../../utils/pagination'

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = (req as any).postId
    const userId = (req as any).user.id
    const { body } = req.body
    const comment = await svc.create(postId, userId, body)
    res.status(201).json({ comment })
  } catch (e) { next(e) }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = (req as any).postId
    const { p, l } = getPagination(Number(req.query.page as any), Number(req.query.limit as any))
    const result = await svc.list(postId, p, l)
    res.json(result)
  } catch (e) { next(e) }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.commentId)
    const userId = (req as any).user.id
    const { body } = req.body
    const comment = await svc.update(id, userId, body)
    res.json({ comment })
  } catch (e) { next(e) }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.commentId)
    const userId = (req as any).user.id
    await svc.remove(id, userId)
    res.status(204).send()
  } catch (e) { next(e) }
}