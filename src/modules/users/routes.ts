import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { me } from './controller'

const router = Router()

router.get('/me', requireAuth, me)

export default router