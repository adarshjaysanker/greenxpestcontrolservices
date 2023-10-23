var express = require("express");
var router = express.Router();
const Service = require("../model/services");
const Review = require('../model/reviews');
const Gallery = require('../model/gallery')
const transporter = require('../middlewares/nodemailer')

module.exports = {

    getHomePage : async(req,res)=>{
        try{
            const reviews = await Review.find({addtouserpage : true});
            const services = await Service.find();
            res.render('user/index',{reviews , services})
        }catch(error){
            console.error(error);
            res.status(500).send('Internal server error')
        }
    },

    getContactPage : async(req,res)=>{
        const services = await Service.find()
        res.render('user/contact',{services});
    },

   getServicePage : async(req,res)=>{
    try{
        const servicetitle = req.params.serviceTitle;
        const allServices = await Service.find();
        const service = await Service.findOne({servicetitle});
        if(!service){
            return res.status(404).send('service not found');
        }
        res.render('user/services',{service , allServices})
    }catch(error){
        console.error(error);
        res.status(500).send('Internal server error');
    }
   },

   getGalleryPage : async(req,res)=>{
    try{
        const galleryImages = await Gallery.find();
        const services = await Service.find();
        res.render('user/gallery',{galleryImages,services});
    }catch(error){
        console.log(error);
    }
   },

   submitReview : async(req,res)=>{
    try{
        const newReview = new Review({
            name : req.body.name,
            email : req.body.email,
            review : req.body.review,
        });
        await newReview.save();
        res.status(200).send('Review added successfully');
    }catch(error){
        console.error(error);
        res.status(500).send('Internal server error');
    }
   },

   sendMessage : async(req,res)=>{
    const {name, email, phonenumber, subject, message} = req.body;
    const mailOptions = {
        from : email,
        to : 'greenxpcs@gmail.com',
        subject : subject,
        text : `Name : ${name}\nEmail : ${email}\nMobile Number : ${phonenumber}\nMessage : ${message}`,
    };
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log('Error sending email : ',error);
            res.status(500).json({success : false});
        }else{
            console.log(('Email send : '+info.response));
            res.status(200).json({success : true});
        }
    })
   },

   searchData : async(req,res)=>{
    try{
        let payload = req.body.payload.trim();
       let search = await Service.find({serviceName : {$regex : new RegExp('^'+payload+'.*','i')}}).exec()
       search = search.slice(0,10);
       res.send({payload : search})
    }catch(error){
        console.log(error);
    }
   }


}