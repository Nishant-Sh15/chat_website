const mongoose=require("mongoose");


const chatSchema=mongoose.Schema({
    contributors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    mssgs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
});

const Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;