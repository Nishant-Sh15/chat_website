const mongoose=require("mongoose");

const contactSchema=mongoose.Schema({
    
    arr:[{
        person:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        conversation:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        }
    }]
});
const Contact=mongoose.model("Contact",contactSchema);
module.exports=Contact;
