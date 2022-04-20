import mongoose from "mongoose"

const followingSchema = new mongoose.Schema({
    user_id : {type: String, require: true},
    following_id : {type: String, require: true}
})

export default mongoose.model('Following', followingSchema)