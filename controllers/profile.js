// importing mongoose models
const User=require("../models/users");
const ExpressError = require("../utils/ExpressError");

// ---------show profile----------
module.exports.show=async(req,res,next)=>{
    let {usrId,conName}=req.params;
    let user=await User.findById(usrId);
    let con=await User.findOne({username:conName});
    if(con!=null){
        console.log(con.posts);
        res.render("profile.ejs",{con,user});
    }else{
        req.flash("error","this user doesn't exist");
        res.redirect(`/home/${usrId}`);
    }
    // next(new ExpressError(404,"page not found"));
}
// ---------------------------------------------

// -----------render edit page-----------------------
module.exports.showEditPage=async (req, res) => {
    let { usrId } = req.params;
    let user = await User.findById(usrId);
    res.render("changeInfo.ejs", { user });
}
// -----------------------------------------------

// ------------------------put request for editting-----------
module.exports.edit=async (req, res) => {
    let {usrId} = req.params;
    let { name, bio } = req.body;
    let user = await User.findById(usrId);
    if(req.file!=undefined){
        user.profile = req.file.path;
    }
    user.name = name;
    user.bio = bio;
    await user.save();
    res.redirect(`/profile/my/${usrId}`);
}
// -----------------------------------------------------------


// ----------------show my profile------------
module.exports.my=async (req, res) => {
    let {usrId} = req.params;
    let user = await User.findById(usrId);
    res.render("myProfile.ejs", { user });
}
// ------------------------------------------


// ---------------show add post form----------
module.exports.showPostForm=(req,res)=>{
    let {usrId}=req.params;
    res.render("post.ejs",{usrId});
}
// --------------------------------------------

// ----------------create post------------------
module.exports.createPost=async(req,res)=>{
    console.log("inside");
    let {usrId}=req.params;
    let user=await User.findById(usrId);
    console.log(user);
    if(req.file!=undefined){
        let post={
            url:req.file.path,
            caption:req.body.caption
        }
        user.posts.splice(user.posts.length,0,post);
        await user.save();
        res.redirect(`/profile/my/${usrId}`);
    }else{
        req.flash("error","give valid data")
        res.redirect(`/profile/post/:usrId`);
    }
}