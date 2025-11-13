import request from 'supertest'
import app from '../src/app'
jest.mock('bcrypt', () => ({
  __esModule: true,
  default: {
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue('hash')
  }
}))
jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn().mockReturnValue('token')
  }
}))

jest.mock('../src/db/prisma', () => {
  return {
    prisma: {
      user: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1, email: 'a@b.com', username: 'alice', password: 'hash' }),
        findUnique: jest.fn().mockResolvedValue({ id: 1, email: 'a@b.com', username: 'alice', password: 'hash' })
      }
    }
  }
})

describe('POST /api/auth/register', () => {
  it('rejects invalid body with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('rejects invalid body with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(400)
  })
})