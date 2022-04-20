"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.searchBlogByTitle = exports.getAllBlogsByAuthor = exports.getBlogById = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const User_1 = __importDefault(require("../models/User"));
const createBlog = (req, res) => {
    const body = req.body;
    User_1.default.findOne({ _id: body.author_id }).exec().then(doc => {
        if (!doc) {
            return res.status(409).json({ message: "Invalid Request!" });
        }
        const newBlog = new Blog_1.default({
            author_id: body.author_id,
            title: body.title,
            content: body.content,
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
    Blog_1.default.findOne({ _id: req.params.id }).exec().then((doc) => {
        if (!doc) {
            return res.status(404).json({ message: 'Blog Not Found!' });
        }
        return res.status(200).json({ blog: doc });
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
    Blog_1.default.findOneAndDelete({ _id: req.params.id }).exec().then((doc) => {
        if (!doc) {
            return res.status(409).json({ message: 'Invalid Request' });
        }
        res.status(200).json({ message: "Blog Deleted Successfully" });
    }).catch((err) => res.status(500).json({ message: err.message }));
};
exports.deleteBlog = deleteBlog;
