const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    profile: String,
    bio: String,
    posts: [{
        url: String,
        caption:String
    }],
    contacts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    },
    bio: String,
    socketId:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;