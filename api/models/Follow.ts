import mongoose from "mongoose";
const followSchema = new mongoose.Schema({
    follower_id : {type: String,require : true},
    user_id : {type: String, require : true}
})
export default mongoose.model("Follow", followSchema);