import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { createCommentSchema, updateCommentSchema, listCommentsSchema } from './validators'
import * as ctrl from './controller'

const router = Router({ mergeParams: true })

router.get('/', validate(listCommentsSchema), ctrl.list)
router.post('/', requireAuth, validate(createCommentSchema), ctrl.create)
router.patch('/:commentId', requireAuth, validate(updateCommentSchema), ctrl.update)
router.delete('/:commentId', requireAuth, ctrl.remove)

export default router