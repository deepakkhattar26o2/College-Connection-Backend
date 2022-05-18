import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {type: String,unique: true, require: true, matches: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/},
    userName: {type: String},
    first_name: {type: String, require: true},
    last_name:{type: String, require: true},
    password: {type: String, require: true, min: 6},
    temp:{type: String, default: 'baka'},
    class: {type: Number, require: true},
    major: {type: String, require: true},
    bio: {type: String, default: 'I Love College Connection!'}
})

export default mongoose.model("User", userSchema);