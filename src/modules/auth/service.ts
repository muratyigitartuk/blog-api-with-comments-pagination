import { prisma } from '../../db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../../config/env'

export async function register(email: string, username: string, password: string) {
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } })
  if (exists) throw { status: 409, message: 'User exists' }
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, username, password: hash } })
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' })
  return { user: { id: user.id, email: user.email, username: user.username }, token }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { status: 401, message: 'Invalid credentials' }
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw { status: 401, message: 'Invalid credentials' }
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' })
  return { user: { id: user.id, email: user.email, username: user.username }, token }
}