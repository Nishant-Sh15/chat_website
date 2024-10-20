const mongoose=require("mongoose");

const messageSchema=mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:String,
    time:{
        type:Date,
        default:Date.now()
    },
    num:Number
});

const Message=mongoose.model("Message",messageSchema);
module.exports=Message;