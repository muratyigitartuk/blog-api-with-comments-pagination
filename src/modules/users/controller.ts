import { Request, Response } from 'express'
import { prisma } from '../../db/prisma'

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.id
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, username: true, createdAt: true } })
  res.json({ user })
}