import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    author_id : {type: String, require: true},
    title: {type: String, require: true},
    created_at: {type:Date, default: new Date()},
    content: {type: String, require: true},
    likes: {type: Number, default: 0},
    // sub_title : {type: String, default : ""}
    // dislikes: {type: Number,  default: 0}
})

export default mongoose.model('Blog', blogSchema)