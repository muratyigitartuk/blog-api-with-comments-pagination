import { z } from 'zod'

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    imageUrl: z.string().url().optional()
  })
})

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    imageUrl: z.string().url().optional()
  })
})

export const listPostsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    authorId: z.string().optional(),
    sortBy: z.enum(['createdAt', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
})