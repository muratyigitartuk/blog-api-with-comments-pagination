import app from './app'
import { config } from './config/env'

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

process.on('SIGINT', () => {
  server.close(() => process.exit(0))
})
process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})