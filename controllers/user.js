// importing mongoose models
const User=require("../models/users");
const Contact=require("../models/contacts");
const Chat=require("../models/chat");
const Message=require("../models/messages");


// --------------------sign up(creating user)--------------
module.exports.signup=async (req,res,next)=>{
    try{
        const {userName,password}=req.body;
        // console.log(req.body);
        let newUser=new User({username:userName,posts:[],name:"",profile:'https://res.cloudinary.com/dvvgsyiu8/image/upload/v1729619820/no_profile_ayr2np.png',bio:"",socketId:""});
        let usrCon=new Contact({arr:[]});
        await usrCon.save();
        newUser.contacts=usrCon;
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to CHIT-CHAT");
            
            res.redirect(`/home/${registeredUser._id}`);
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/Signup");
    }
};