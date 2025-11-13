import { Router } from 'express'
import { validate } from '../../middleware/validate'
import { registerSchema, loginSchema } from './validators'
import * as ctrl from './controller'

const router = Router()

router.post('/register', validate(registerSchema), ctrl.register)
router.post('/login', validate(loginSchema), ctrl.login)

export default router