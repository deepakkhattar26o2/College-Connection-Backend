import express from 'express'
import { createBlog, createComment, deleteBlog, deleteComment, getAllBlogsByAuthor, getBlogById, likeBlog, searchBlogByTitle, unlikeBlog, updateBlog, getAllBlogs } from '../controllers/Blog'
import upload from '../../upload'
const router = express.Router()

router.post('/new', createBlog)

router.get('/user/:id', getAllBlogsByAuthor)//author id

router.get('/all', getAllBlogs);

router.get('/search/:title', searchBlogByTitle)//title for blog

router.get('/u/:id', getBlogById)//blog id

router.patch('/u/:id', updateBlog)

router.delete('/u/:id', deleteBlog)

router.patch('/l', likeBlog)

router.patch('/ul', unlikeBlog)

//comments
router.post('/c', createComment)

router.delete('/c', deleteComment)

export default router