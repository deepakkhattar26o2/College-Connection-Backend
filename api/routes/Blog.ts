import express from 'express'
import { createBlog, deleteBlog, getAllBlogsByAuthor, getBlogById, searchBlogByTitle, updateBlog } from '../controllers/Blog'
const router = express.Router()
router.post('/new', createBlog)

router.get('/user/:id', getAllBlogsByAuthor)//author id

router.get('/search/:title', searchBlogByTitle)//title for blog

router.get('/u/:id', getBlogById)//blog id

router.patch('/u/:id', updateBlog)

router.delete('/u/:id', deleteBlog)

export default router