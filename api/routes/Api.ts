import express from 'express'
const router = express.Router()
import userRouter from './User'
import passForRouter from './ForgotPassword'
import blogRouter from './Blog'

router.use('/user', userRouter);
router.use('/forgot', passForRouter);
router.use('/blog', blogRouter)

export default router