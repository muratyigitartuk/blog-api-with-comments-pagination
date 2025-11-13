import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { rateLimiter } from './middleware/rateLimit'
import { errorHandler } from './middleware/error'
import routes from './routes'
import { config } from './config/env'
import { prisma } from './db/prisma'

const app = express()
app.use(express.json())
app.use(cors({ origin: config.corsOrigin === '*' ? undefined : config.corsOrigin }))
app.use(helmet())
app.use(morgan('dev'))
app.use(rateLimiter)
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'up' })
  } catch {
    res.status(500).json({ status: 'degraded', db: 'down' })
  }
})
app.use('/api', routes)
app.use(errorHandler)

export default app