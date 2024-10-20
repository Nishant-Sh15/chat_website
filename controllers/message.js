// importing mongoose models
const User=require("../models/users");
const Contact=require("../models/contacts");
const Chat=require("../models/chat");
const Message=require("../models/messages");


// -----------add message------------
module.exports.add=async(req,res,next)=>{
    let {usrId,conId}=req.params;
    let {message,author,time=new Date()}=req.body;
    let mssg=new Message({
        message:message,
        author:author,
        time:time
    });
    await mssg.save();

    let chat=await Chat.find({contributors:{$all:[usrId,conId]}});

    for(let i=0;i<chat.length;i++){
        chat[i].mssgs.splice(0,0,mssg);
        chat[i].save();
    }
    let user=await User.findById(usrId);
    let con=await User.findById(conId);
    let userCont=await Contact.findById(user.contacts);
    let conCont=await Contact.findById(con.contacts);
    let index=0;
    for(contact of userCont.arr){
        if(contact.person==conId){
            let ch=userCont.arr.splice(index,1);
            userCont.arr.splice(0,0,ch[0]);
            userCont.save();
            break;
        }
        index++;
    }
    index=0;
    for(contact of conCont.arr){
        if(contact.person==usrId){
            // console.log(index);
            // console.log(conCont.arr);
            let ch=conCont.arr.splice(index,1);
            // console.log(ch);
            // console.log(conCont.arr);
            conCont.arr.splice(0,0,ch[0]);
            // console.log(conCont.arr);
            conCont.save();
            break;
        }
        index++;
    }
    let response={result:mssg._id};
    res.json(response);

}
// ------------------------------------------------


// -------------delete message-----------------
module.exports.delete=async (req,res,next)=>{
    let {usrId,conId}=req.params;
    let {msgId}=req.body;
    let user= await User.findById(usrId).populate({path:"contacts",model:"Contact"});
    let chatId;
    for(contact of user.contacts.arr){
        if(contact.person==conId){
            chatId=contact.conversation;
            break;
        }
    }
    let chat=await Chat.findById(chatId);
    let i=chat.mssgs.indexOf(msgId);
    chat.mssgs.splice(i,1);
    // console.log(chat.mssgs);
    await chat.save();
    let chats=await Chat.find({contributors:{$all:[usrId,conId]}});
    if(chats[0].mssgs.indexOf(msgId)!=-1 && chats[1].mssgs.indexOf(msgId)!=-1){
        await Message.findOneAndDelete({_id:msgId});
    }  
    res.json({result:"deleted"});
}
// -------------------------------------------



// ------------------------unsend message--------------------
module.exports.unsend=async (req,res,next)=>{
    let {usrId,conId}=req.params;
    let {msgId}=req.body;
    let user=await User.findById(usrId).populate({path:"contacts",model:"Contact"});
    let con=await User.findById(conId).populate({path:"contacts",model:"Contact"});
    let chats=await Chat.find({contributors:{$all:[usrId,conId]}});
    for(let i=0;i<chats.length;i++){
        let index=chats[0].mssgs.indexOf(msgId);
        chats[0].mssgs.splice(index,1);
    }
    // await chats.save();
    await Message.findByIdAndDelete(msgId);
    res.json({result:"unsend"});
}

