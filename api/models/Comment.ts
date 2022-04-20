import mongoose from "mongoose"
const commentSchema = new mongoose.Schema({
    blog_id : {type: String, require: true},
    user_id : {type: String, require: true}, //the id of user who commented
    content : {type: String, require: true},
    created_at : {type: Date, default: new Date()}
})

export default mongoose.model('Comments', commentSchema)