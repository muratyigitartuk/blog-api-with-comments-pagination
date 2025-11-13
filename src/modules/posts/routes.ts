import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { createPostSchema, updatePostSchema, listPostsSchema } from './validators'
import * as ctrl from './controller'
import commentRoutes from '../comments/routes'
import { upload } from '../../middleware/upload'

const router = Router()

router.get('/', validate(listPostsSchema), ctrl.list)
router.get('/:id', ctrl.get)
router.post('/', requireAuth, validate(createPostSchema), ctrl.create)
router.patch('/:id', requireAuth, validate(updatePostSchema), ctrl.update)
router.delete('/:id', requireAuth, ctrl.remove)
router.post('/:id/like', requireAuth, ctrl.like)
router.post('/:id/unlike', requireAuth, ctrl.unlike)
router.post('/:id/image', requireAuth, upload.single('image'), ctrl.uploadImage)
router.delete('/:id/image', requireAuth, ctrl.deleteImage)

router.use('/:id/comments', (req, res, next) => { (req as any).postId = Number(req.params.id); next() }, commentRoutes)
export default router