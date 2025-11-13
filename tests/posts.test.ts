import request from 'supertest'
import app from '../src/app'

jest.mock('../src/db/prisma', () => {
  const data = [{ id: 1, title: 'Hello', body: 'World', authorId: 1, createdAt: new Date(), updatedAt: new Date(), _count: { likedBy: 0, comments: 0 }, author: { id: 1, username: 'alice' } }]
  return {
    prisma: {
      post: {
        count: jest.fn().mockResolvedValue(1),
        findMany: jest.fn().mockResolvedValue(data)
      }
    }
  }
})

describe('GET /api/posts', () => {
  it('returns paginated list', async () => {
    const res = await request(app).get('/api/posts?page=1&limit=10')
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
    expect(res.body.meta.page).toBe(1)
  })
})