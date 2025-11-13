export function getPagination(page?: number, limit?: number) {
  const p = Math.max(1, Number(page) || 1)
  const l = Math.min(100, Math.max(1, Number(limit) || 10))
  const skip = (p - 1) * l
  const take = l
  return { p, l, skip, take }
}

export function buildMeta(page: number, limit: number, totalItems: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const hasNext = page < totalPages
  const hasPrev = page > 1
  return { page, limit, totalItems, totalPages, hasNext, hasPrev }
}