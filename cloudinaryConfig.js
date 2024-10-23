require("dotenv").config();
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:'dvvgsyiu8',
    api_key:'376165332934962',
    api_secret:'NpcurpWbuQIzYrpdhEcCOmtMeLM',
});

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"chit_chat",
        allowedFormat:['png','jpg','jpeg']
    }
});

module.exports={cloudinary,storage};