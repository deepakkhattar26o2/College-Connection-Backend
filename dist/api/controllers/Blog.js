"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeBlog = exports.likeBlog = exports.deleteComment = exports.createComment = exports.deleteBlog = exports.updateBlog = exports.searchBlogByTitle = exports.getAllBlogsByAuthor = exports.getBlogById = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
const createBlog = (req, res) => {
    const body = req.body;
    User_1.default.findById(body.author_id).exec().then(doc => {
        if (!doc) {
            return res.status(409).json({ message: "Invalid Request!" });
        }
        const newBlog = new Blog_1.default({
            author_id: body.author_id,
            title: body.title,
            content: body.content,
            // sub_title : body.sub_title
        });
        newBlog.save().then((conc) => {
            return res.status(200).json({ message: 'Blog Created Successfully' });
        }).catch((err) => {
            return res.status(500).json({ message: err.message });
        });
    }).catch((err) => { res.status(500).json({ message: err.message }); });
};
exports.createBlog = createBlog;
const getBlogById = (req, res) => {
    Blog_1.default.findById(req.params.id).exec().then((doc) => {
        if (!doc) {
            return res.status(404).json({ message: 'Blog Not Found!' });
        }
        Comment_1.default.find({ blog_id: req.params.id }).exec().then((docs) => {
            const mdocs = docs;
            let marr = [];
            for (let i = 0; i < mdocs.length; i++) {
                User_1.default.findById(mdocs[i].user_id).select("userName").exec().then((usero) => {
                    marr.push(usero.userName);
                }).catch((err) => {
                    return res.status(500).json({ message: err.message });
                });
            }
            User_1.default.findById(doc.author_id).select("_id userName").exec().then((author) => {
                return res.status(200).json({ blog: doc, author_details: author, comments: mdocs || null, commentors: marr || null });
            }).catch((err) => {
                return res.status(500).json({ message: err.message });
            });
        }).catch((err) => {
            res.status(500).json({ message: err.message });
        });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.getBlogById = getBlogById;
const getAllBlogsByAuthor = (req, res) => {
    Blog_1.default.find({ author_id: req.params.id }).exec().then((docs) => {
        if (docs.length === 0) {
            return res.status(409).json({ message: 'No Blogs Found' });
        }
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.getAllBlogsByAuthor = getAllBlogsByAuthor;
const searchBlogByTitle = (req, res) => {
    Blog_1.default.find({ title: new RegExp(req.params.title, '') }).exec().then((docs) => {
        if (docs.length === 0) {
            return res.status(409).json([]);
        }
        return res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.searchBlogByTitle = searchBlogByTitle;
const updateBlog = (req, res) => {
    if (req.body.author_id) {
        return res.status(403).json({ message: "BEGONE!" });
    }
    Blog_1.default.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).exec().then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: 'Invalid Request!' });
        }
        res.status(200).json({ message: 'Blog Updated Successfully', baady: doc });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => {
    Blog_1.default.findByIdAndDelete(req.params.id).exec().then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: 'Invalid Request' });
        }
        res.status(200).json({ message: "Blog Deleted Successfully" });
    }).catch((err) => res.status(500).json({ message: err.message }));
};
exports.deleteBlog = deleteBlog;
const createComment = (req, res) => {
    const body = req.body;
    Blog_1.default.findById(body.blog_id).exec().then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: "Blog doesn't exist anymore!" });
        }
        let comment = new Comment_1.default({
            blog_id: body.blog_id,
            user_id: body.user_id,
            content: body.content,
        });
        comment.save().then((conc) => {
            return res.status(200).json({ message: "Commented Successfully!" });
        }).catch((err) => {
            return res.status(500).json({ message: err.message });
        });
    }).catch((err) => { res.status(500).json({ message: err.message }); });
};
exports.createComment = createComment;
const deleteComment = (req, res) => {
    const body = req.body;
    Comment_1.default.findById(body.comment_id).exec().then(doc => {
        if (!doc || doc.user_id != body.user_id) {
            return res.status(409).json({ message: "Cannot Delete Comment" });
        }
        Comment_1.default.findByIdAndDelete(body.comment_id).exec().then((conc) => {
            res.status(200).json({ message: "Comment Deleted Successfully!" });
        }).catch((err) => {
            return res.status(409).json({ message: err.message });
        });
    }).catch((err) => { res.status(500).json({ message: err.message }); });
};
exports.deleteComment = deleteComment;
const likeBlog = (req, res) => {
    const body = req.body;
    Blog_1.default.findById(body.blog_id).exec().then((doc) => {
        if (!doc) {
            res.status(409).json({ message: "Not Found!" });
        }
        Blog_1.default.updateOne({ _id: body.blog_id }, { $set: { likes: doc.likes + 1 } }).exec().then(conc => {
            res.status(200).json({ message: "Like Successful" });
        }).catch((err) => {
            return res.status(500).json({ message: err.message });
        });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.likeBlog = likeBlog;
const unlikeBlog = (req, res) => {
    const body = req.body;
    Blog_1.default.findById(body.blog_id).exec().then((doc) => {
        if (!doc) {
            res.status(409).json({ message: "Not Found!" });
        }
        Blog_1.default.updateOne({ _id: body.blog_id }, { $set: { likes: doc.likes - 1 } }).exec().then(conc => {
            res.status(200).json({ message: "Like Successful" });
        }).catch((err) => {
            return res.status(500).json({ message: err.message });
        });
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.unlikeBlog = unlikeBlog;
