const express=require("express");

const app=express();
const port=8080;

app.set("view engine","ejs");
app.set("views",`${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.listen(port,()=>{
    console.log("server is listening on port",port);
});