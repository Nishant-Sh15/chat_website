

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated){
        req.flash("error","please login to continue");
        res.redirect("/Login");
    }else{
        // console.log(req.user);
        next();
    }
};

module.exports.isOwner=(req,res,next)=>{
    if(req.user!=undefined){
        if(req.user._id==req.params.usrId){
            next();
        }else if(req.user._id==req.body.usrId){
            next();
        }
    }else{
        req.flash("error","you are not the owner of this account ");
        res.redirect("/Login");
    }
}