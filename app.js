const express=require("express");
const http=require("http");
const socketIo=require("socket.io");
const mongoose=require("mongoose");

const session=require("express-session");
const flash=require("connect-flash");


const passport=require("passport");
const LocalStrategy=require("passport-local");

const ExpressError=require("./utils/ExpressError");
const wrapAsync=require("./utils/wrapAsync");

// for test adding controllers
const index=require("./controllers/index");
const message=require("./controllers/message");
let contact=require("./controllers/contact");
let profile=require("./controllers/profile");
const users=require("./controllers/user");


// ----------------importing schemas-------------
const User=require("./models/users");
const Contact=require("./models/contacts");
const Chat=require("./models/chat");
const Message=require("./models/messages");
// -----------------------------------------------

// -----------requiring middlewares--------------------
const{isLoggedIn, isOwner}=require("./middleware");


// ------------connecting to mongoose database----
async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/gossip");
}
main()
    .then(()=>{console.log("connection to mongoose successfully done")})
    .catch((err)=>{console.log(err)});



const app=express();
const server=http.createServer(app);
const io=socketIo(server);
const port=8080;



app.set("view engine","ejs");
app.set("views",`${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const sessionOptions={
    secret:"mySecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*3600*1000
    },
    httpOnly:true
};
app.use(session(sessionOptions));
app.use(flash());
//-------------------- configuring passport---------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});


// -----------home route-------------------------------------------------------------------------
app.get("/home/:usrId",isLoggedIn,isOwner,wrapAsync(index.home));
// --------------------------------------------------------------------------------------------------



// ------------------------------show route--------------------------------------------------------
app.get("/show/:usrId/:conId",isLoggedIn,isOwner,wrapAsync(index.show));
// --------------------------------------------------------------------------------------------


// ------------------------add message------------------------------------------
app.post("/show/:usrId/:conId",isLoggedIn,isOwner,wrapAsync(message.add));
// -----------------------------------------------
// -----------------------------delete contact-----------
app.delete("/Contact",isLoggedIn,isOwner,wrapAsync(contact.delete));
// ------------------------------------------

// ---------------------delete message-------------------------
app.delete("/:usrId/:conId",isLoggedIn,isOwner,wrapAsync(message.delete));
// -----------------------------------------------------

// ------------------------------------unsend------------------------------
app.delete("/unsend/:usrId/:conId",isLoggedIn,isOwner,wrapAsync(message.unsend));
// ------------------------------------------------------------

// -------------------------------create new chat-------------------
app.get("/newChat/:usrId/:conId",isLoggedIn,isOwner,wrapAsync(contact.create));
// ------------------------------------------------------------


// -----------------------------------show profile------------------
app.get("/profile/:usrId/:conName",wrapAsync(profile.show));
// -------------------------------------------------------------

// ----------------------------------show my profile---------------------------
app.get("/profile/my",isLoggedIn,async(req,res)=>{
    let usrId=req.user._id;
    let user=await User.findById(usrId);
    res.render("myProfile.ejs",{user});
})

// ------------------------------------signup------------------------
app.get("/Signup",(req,res)=>{
    res.render("signup.ejs");
});

app.post("/Signup",wrapAsync(users.signup));
// ------------------------------------------------------

// ---------------------------------Login-----------------------------
app.get("/Login",(req,res)=>{
    res.render("login.ejs");
});
app.post("/Login",passport.authenticate("local",{failureRedirect:"/Login",failureFlash:true}),(req,res)=>{
    res.redirect(`/home/${req.user._id}`);
});

// -------------------------------------------------------------

// -----------------------socket io connection------------------------------
io.on('connection',(socket)=>{
    console.log("a user connected");
    
// ----------------storing socket id--------------
    socket.on("join",async (usrId)=>{
        let usr=await User.findById(usrId);
        usr.socketId=socket.id;
        await usr.save();
    });


// -------------sending message----------------------
    socket.on("sendMessage",async (data)=>{
        console.log("sending message");
        let {usrId,conId,message,msgId}=data;

        let con=await User.findById(conId);
        if(con && con.socketId.length>0){
            io.to(con.socketId).emit("recieveMessage",{
                message,
                msgId,
                contact:usrId
            });
        }else{
            console.log("user not connected");
        }
    });


// -------------------while disconnecting--------
    socket.on("disconnect",async ()=>{
        console.log(socket.id);
        let usr=await User.findOne({socketId:socket.id});
        usr.socketId="";
        console.log(usr);
        await usr.save();
    });
});

// --------------------------------------------------


// --------------------------------------------------------------------

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// });

// app.use((err,req,res,next)=>{
//     let {status,message}=err;
//     res.status(status).send(message);
// });


server.listen(port,()=>{
    console.log("server is listening on port",port);
});