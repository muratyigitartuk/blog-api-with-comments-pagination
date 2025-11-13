import { Request, Response, NextFunction } from 'express'
import * as svc from './service'
import { getPagination } from '../../utils/pagination'

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id
    const { title, body, imageUrl } = req.body
    const post = await svc.create(userId, title, body, imageUrl)
    res.status(201).json({ post })
  } catch (e) { next(e) }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { p, l } = getPagination(Number(req.query.page as any), Number(req.query.limit as any))
    const search = req.query.search as string | undefined
    const authorId = req.query.authorId ? Number(req.query.authorId) : undefined
    const sortBy = (req.query.sortBy as any) || undefined
    const sortOrder = (req.query.sortOrder as any) || undefined
    const result = await svc.list(p, l, search, authorId, sortBy, sortOrder)
    res.json(result)
  } catch (e) { next(e) }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const post = await svc.get(id)
    if (!post) return res.status(404).json({ message: 'Not found' })
    res.json({ post })
  } catch (e) { next(e) }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const userId = (req as any).user.id
    const post = await svc.update(id, userId, req.body)
    res.json({ post })
  } catch (e) { next(e) }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const userId = (req as any).user.id
    await svc.remove(id, userId)
    res.status(204).send()
  } catch (e) { next(e) }
}

export async function like(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const userId = (req as any).user.id
    const r = await svc.like(id, userId)
    res.json(r)
  } catch (e) { next(e) }
}

export async function unlike(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const userId = (req as any).user.id
    const r = await svc.unlike(id, userId)
    res.json(r)
  } catch (e) { next(e) }
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const userId = (req as any).user.id
    const file = (req as any).file
    if (!file) return res.status(400).json({ message: 'No file' })
    const { uploadBuffer } = await import('../../utils/cloudinary')
    const result = await uploadBuffer(file.buffer, 'blog-api')
    const post = await svc.setImage(id, userId, result.secure_url)
    res.json({ post })
  } catch (e) { next(e) }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const userId = (req as any).user.id
    const post = await svc.setImage(id, userId, null)
    res.json({ post })
  } catch (e) { next(e) }
}