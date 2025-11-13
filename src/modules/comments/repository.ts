import { prisma } from '../../db/prisma'

export async function createComment(postId: number, authorId: number, body: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw { status: 404, message: 'Not found' }
  return prisma.comment.create({ data: { postId, authorId, body } })
}

export async function listComments(postId: number, skip: number, take: number) {
  const totalItems = await prisma.comment.count({ where: { postId } })
  const data = await prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'desc' }, skip, take, include: { author: { select: { id: true, username: true } } } })
  return { data, totalItems }
}

export async function getComment(id: number) {
  return prisma.comment.findUnique({ where: { id } })
}

export async function updateComment(id: number, authorId: number, body: string) {
  const c = await prisma.comment.findUnique({ where: { id } })
  if (!c) throw { status: 404, message: 'Not found' }
  if (c.authorId !== authorId) throw { status: 403, message: 'Forbidden' }
  return prisma.comment.update({ where: { id }, data: { body } })
}

export async function deleteComment(id: number, userId: number) {
  const c = await prisma.comment.findUnique({ where: { id }, include: { post: true } })
  if (!c) throw { status: 404, message: 'Not found' }
  if (c.authorId !== userId && c.post.authorId !== userId) throw { status: 403, message: 'Forbidden' }
  await prisma.comment.delete({ where: { id } })
}