const express=require("express");
const multer=require("multer");
const{storage}=require("./cloudinaryConfig");
const upload=multer({storage});

const app=express();


app.get("/",(req,res)=>{
    res.send('<form  action="/" method="POST" enctype="multipart/form-data"><input type="file" name="profile" id="file-input" ><button class="submit">Save</button></form>');
});
app.post("/", (req, res) => {
    // Pass the request to multer's single method and handle the callback
    upload.single("profile")(req, res, (err) => {
        console.log("Upload middleware reached");

        // Check for multer errors
        if (err instanceof multer.MulterError) {
            console.error("Multer error:", err);
            return res.status(500).send("Multer error occurred during file upload.");
        } else if (err) {
            console.error("Unknown error:", err);
            return res.status(500).send("Unknown error occurred.");
        }

        // Check if the file exists
        if (!req.file) {
            console.log("No file uploaded.");
            return res.status(400).send("No file uploaded.");
        }

        // If the file was uploaded successfully
        console.log("File uploaded successfully:", req.file);
        return res.send(`File uploaded successfully: ${req.file.path || req.file.filename || req.file.url}`);
    });
});


app.listen(3030,()=>{
    console.log("listning");
});
