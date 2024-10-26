// importing mongoose models
const User=require("../models/users");
const Contact=require("../models/contacts");
const Chat=require("../models/chat");
const Message=require("../models/messages");

// --------------home route------------
module.exports.home=async (req,res,next)=>{
    let{usrId}=req.params;
    // let user=await User.findOne({username:"nishant"});
    let user=await User.findById(usrId);
    let contacts=await Contact.findById(user.contacts).populate({path:"arr.person",model:"User"})
                              .populate({path:"arr.conversation",model:"Chat"});
    let chats=[];
    for(let i=0;i<contacts.arr.length;i++){
        let msg=contacts.arr[i].conversation.mssgs;
        let mssg_n=await Message.findById(msg[0]);
        chats.push(mssg_n);
        // console.log(mssg_n);
    }
    let conv=null;
    let con=user;
    // console.log(contacts.arr);
    res.render("index.ejs",{user,contacts:contacts.arr,chats,conv,con});
}
// ----------------------------------



// ----------------show route------------
module.exports.show=async (req,res,next)=>{
    let {usrId,conId}=req.params;
    let user= await User.findById(usrId).populate({path:"contacts",model:"Contact"});
    let chatId;
    for(contact of user.contacts.arr){
        if(contact.person==conId){
            chatId=contact.conversation;
            break;
        }
    }
    let conv=await Chat.findById(chatId).populate({path:"mssgs",model:"Message"});
    let con=await User.findById(conId); 
    let contacts=await Contact.findById(user.contacts).populate({path:"arr.person",model:"User"})
                              .populate({path:"arr.conversation",model:"Chat"});
    let chats=[];
    // console.log(contacts.arr);
    for(let i=0;i<contacts.arr.length;i++){
        let msg=contacts.arr[i].conversation.mssgs;
        let mssg_n=await Message.findById(msg[0]);
        chats.push(mssg_n);
    }
    // console.log(chats);
    if(chatId==null){
        res.redirect(`/home/${usrId}`);
    }else{
        res.render("index.ejs",{user,contacts:contacts.arr,chats,conv,con});
    }
}
// ------------------------------------------