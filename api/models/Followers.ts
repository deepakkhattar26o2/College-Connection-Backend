import mongoose from "mongoose"
const followerSchema = new mongoose.Schema({
    user_id : {type: String, require: true},
    follower_id : {type: String, require: true}
})

export default mongoose.model('Followers', followerSchema)