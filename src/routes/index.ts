import { Router } from 'express'
import authRoutes from '../modules/auth/routes'
import userRoutes from '../modules/users/routes'
import postRoutes from '../modules/posts/routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)

export default router