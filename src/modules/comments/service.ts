import * as repo from './repository'
import { buildMeta } from '../../utils/pagination'

export async function create(postId: number, authorId: number, body: string) {
  return repo.createComment(postId, authorId, body)
}

export async function list(postId: number, page: number, limit: number) {
  const { data, totalItems } = await repo.listComments(postId, (page - 1) * limit, limit)
  const meta = buildMeta(page, limit, totalItems)
  return { data, meta }
}

export async function update(id: number, authorId: number, body: string) {
  return repo.updateComment(id, authorId, body)
}

export async function remove(id: number, userId: number) {
  await repo.deleteComment(id, userId)
  return true
}