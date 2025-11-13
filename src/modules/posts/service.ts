import * as repo from './repository'
import { buildMeta } from '../../utils/pagination'

export async function create(authorId: number, title: string, body: string, imageUrl?: string) {
  return repo.createPost(authorId, title, body, imageUrl)
}

export async function get(id: number) {
  return repo.getPost(id)
}

export async function update(id: number, authorId: number, data: { title?: string; body?: string; imageUrl?: string }) {
  return repo.updatePost(id, authorId, data)
}

export async function remove(id: number, authorId: number) {
  await repo.deletePost(id, authorId)
  return true
}

export async function list(page: number, limit: number, search?: string, authorId?: number, sortBy?: 'createdAt'|'title', sortOrder?: 'asc'|'desc') {
  const { data, totalItems } = await repo.listPosts({ page, limit, search, authorId, sortBy, sortOrder })
  const meta = buildMeta(page, limit, totalItems)
  return { data, meta }
}

export async function like(postId: number, userId: number) {
  await repo.likePost(postId, userId)
  const post = await repo.getPost(postId)
  return { liked: true, likes: post?._count?.likedBy || 0 }
}

export async function unlike(postId: number, userId: number) {
  await repo.unlikePost(postId, userId)
  const post = await repo.getPost(postId)
  return { liked: false, likes: post?._count?.likedBy || 0 }
}

export async function setImage(postId: number, authorId: number, imageUrl: string | null) {
  return repo.setPostImage(postId, authorId, imageUrl)
}