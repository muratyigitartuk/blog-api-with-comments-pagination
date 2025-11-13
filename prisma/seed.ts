import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function run() {
  const password = await bcrypt.hash('password123', 10)
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', username: 'alice', password }
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', username: 'bob', password }
  })
  const post = await prisma.post.create({ data: { title: 'Hello', body: 'First post', authorId: alice.id } })
  await prisma.comment.create({ data: { body: 'Nice post', postId: post.id, authorId: bob.id } })
}

run().finally(() => prisma.$disconnect())