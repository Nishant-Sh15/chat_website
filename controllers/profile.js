// importing mongoose models
const User=require("../models/users");
const ExpressError = require("../utils/ExpressError");

// ---------show profile----------
module.exports.show=async(req,res,next)=>{
    let {usrId,conName}=req.params;
    let user=await User.findById(usrId);
    let con=await User.findOne({username:conName});
    if(con!=null){
        res.render("profile.ejs",{con,user});
    }else{
        req.flash("error","this user doesn't exist");
        res.redirect(`/home/${usrId}`);
    }
    // next(new ExpressError(404,"page not found"));
}