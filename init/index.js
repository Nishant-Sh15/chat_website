const mongoose=require("mongoose");
const User=require("../models/users");
const Chat=require("../models/chat");
const Message=require("../models/messages");
const Contact=require("../models/contacts");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1/gossip");
}
main().then(()=>{console.log("connected successfully")});

let userArr=["nishant","bharat","mamta","riyansh","aryan","siya","natasha","rishabh"];
let data=[];
for (let i = 0; i < userArr.length; i++) {
    let data1={
        username:userArr[i],
        profile:["/images/no_profile.png"],
        bio:"hello"
    }
    data.push(data1);
    
}
async function del(){
    await User.deleteMany({});
    await Message.deleteMany({});
    await Chat.deleteMany({});
    await Contact.deleteMany({});
    console.log("everything deleted successfully");
    User.insertMany(data);
    console.log("all users added successfully");
    
}
// del().then(()=>{console.log(1)});


async function send(){
    let nishant=await User.findOne({username:"nishant"});
    console.log(nishant);
    let nishantContacts=new Contact();
    for(let i=1;i<userArr.length;i++){
        let person = await User.findOne({username:`${userArr[i]}`});
        console.log(person.username);
        let mssg= new Message({author:nishant,message:`hii! ${person.username}`,num:1});
        await mssg.save();
        let usrChat=new Chat({
            contributors:[nishant._id,person._id],
            mssgs:[mssg]
        });
        let perchat=new Chat({
            contributors:[nishant._id,person._id],
            mssgs:[mssg]
        });
        // let contri=[nishant._id,person._id]
        // if("nishant"<person.username){
            // newChat.contributors.push(nishant._id);
            // newChat.contributors.push(person._id);
        // }else{
        //     newChat.contributors.push(nishant._id);
        //     newChat.contributors.push(person._id);

        // }
        await usrChat.save();
        await perchat.save();
        // let usercontact=new Contact({contacts:[{person:person,conversation:newChat}]});
        // usercontact.contacts.person=person;
        // usercontact.contacts.conversation=newChat;
        // await usercontact.save;
        nishantContacts.arr.push({person:person,conversation:usrChat});
        
        let usercontact2=new Contact({arr:[{person:nishant,conversation:perchat}]});
        // usercontact.contacts.person=nishant;
        // usercontact.contacts.conversation=newChat;
        await usercontact2.save();
        person.contacts=usercontact2;
        await person.save();
        
        
        
    }
    await nishantContacts.save();
    nishant.contacts=nishantContacts;
    await nishant.save();
    console.log("messages added successfully");
}
send().then(()=>{console.log(2)});


