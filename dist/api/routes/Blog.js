"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Blog_1 = require("../controllers/Blog");
const mut = require('../../app');
const upload = mut.upload;
const router = express_1.default.Router();
router.post('/new', upload.single("pfp"), Blog_1.createBlog);
router.get('/user/:id', Blog_1.getAllBlogsByAuthor); //author id
router.get('/search/:title', Blog_1.searchBlogByTitle); //title for blog
router.get('/u/:id', Blog_1.getBlogById); //blog id
router.patch('/u/:id', Blog_1.updateBlog);
router.delete('/u/:id', Blog_1.deleteBlog);
router.patch('/l', Blog_1.likeBlog);
router.patch('/ul', Blog_1.unlikeBlog);
//comments
router.post('/c', Blog_1.createComment);
router.delete('/c', Blog_1.deleteComment);
exports.default = router;
