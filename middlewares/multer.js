const express = require('express')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:'dryuwxaf6',
    api_key:'683424611214174',
    api_secret:'nEppa5gn66QyzHp4Wtp4izq-raE'
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"RIGHT FIT",
        allowedFormats:['jpeg','png','jpg']
    }
});
module.exports = {
    cloudinary,storage
};