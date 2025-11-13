import { prisma } from '../../db/prisma'

export async function createPost(authorId: number, title: string, body: string, imageUrl?: string) {
  return prisma.post.create({ data: { authorId, title, body, imageUrl } })
}

export async function getPost(id: number) {
  return prisma.post.findUnique({ where: { id }, include: { _count: { select: { likedBy: true, comments: true } }, author: { select: { id: true, username: true } } } })
}

export async function updatePost(id: number, authorId: number, data: { title?: string; body?: string; imageUrl?: string }) {
  const exists = await prisma.post.findUnique({ where: { id } })
  if (!exists || exists.authorId !== authorId) throw { status: 403, message: 'Forbidden' }
  return prisma.post.update({ where: { id }, data })
}

export async function deletePost(id: number, authorId: number) {
  const exists = await prisma.post.findUnique({ where: { id } })
  if (!exists || exists.authorId !== authorId) throw { status: 403, message: 'Forbidden' }
  await prisma.post.delete({ where: { id } })
}

export async function listPosts(params: { page: number; limit: number; search?: string; authorId?: number; sortBy?: 'createdAt'|'title'; sortOrder?: 'asc'|'desc' }) {
  const where: any = {}
  if (params.search) where.title = { contains: params.search, mode: 'insensitive' }
  if (params.authorId) where.authorId = params.authorId
  const orderBy = { [params.sortBy || 'createdAt']: params.sortOrder || 'desc' } as any
  const totalItems = await prisma.post.count({ where })
  const data = await prisma.post.findMany({ where, orderBy, skip: (params.page - 1) * params.limit, take: params.limit, include: { _count: { select: { likedBy: true, comments: true } }, author: { select: { id: true, username: true } } } })
  return { data, totalItems }
}

export async function likePost(postId: number, userId: number) {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw { status: 404, message: 'Not found' }
  const liked = await prisma.post.findFirst({ where: { id: postId, likedBy: { some: { id: userId } } } })
  if (liked) return true
  await prisma.post.update({ where: { id: postId }, data: { likedBy: { connect: { id: userId } } } })
  return true
}

export async function unlikePost(postId: number, userId: number) {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw { status: 404, message: 'Not found' }
  const liked = await prisma.post.findFirst({ where: { id: postId, likedBy: { some: { id: userId } } } })
  if (!liked) return true
  await prisma.post.update({ where: { id: postId }, data: { likedBy: { disconnect: { id: userId } } } })
  return true
}

export async function setPostImage(postId: number, authorId: number, imageUrl: string | null) {
  const exists = await prisma.post.findUnique({ where: { id: postId } })
  if (!exists || exists.authorId !== authorId) throw { status: 403, message: 'Forbidden' }
  return prisma.post.update({ where: { id: postId }, data: { imageUrl } })
}