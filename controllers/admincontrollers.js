var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const session = require('express-session')
const Service = require("../model/services");
const Reviews = require('../model/reviews');
const Admin = require('../model/admin');
const Gallery = require('../model/gallery')
const crypto = require('crypto');
const transporter = require('../middlewares/nodemailer')

// const upload = require('../middlewares/multer');
// const uploadServiceImage = upload.single('serviceImage');

const handleErrors = (err)=>{
  console.log(err.message, err.code);
  let errors = {email : '', password : ''};
  if(err.code === 11000){
    errors.email = 'that email is already registered';
    return errors;
  }
  if(err.message.includes("user validation failed")){
    Object.values(err.errors).forEach(({properties})=>{
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}


const maxAge = 1 * 24 * 60 * 60;
const createToken = (id)=>{
  return jwt.sign({id},'greenxgreenxxxsecret',{
    expiresIn : maxAge
  })
}

module.exports = {
  getAdminDashboard: async (req, res) => {
    res.render("admin/index");
  },

  getServicePage: async (req, res) => {
    try {
      const services = await Service.find();
      res.render("admin/services", { services });
    } catch (error) {
      res.status(500).json({ error: "error fetching services", error });
    }
  },

  addService: async (req, res) => {
    try {
      console.log(req.body);
      const { serviceName, serviceDescription, serviceFeatures, serviceTitle } =
        req.body;
      const serviceImage = req.file ? req.file.filename : null;
      const features = JSON.parse(serviceFeatures);
      const newService = new Service({
        servicetitle : serviceTitle,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        serviceFeatures: features,
        serviceImage: serviceImage,
      });
      await newService.save();
      res.json({ message: "service added successfully" });
    } catch (error) {
      console.error(error);
    }
  },

  getAddServicePage: async (req, res) => {
    try {
      res.render("admin/addservice");
    } catch (error) {
      console.log("error : ", error);
    }
  },

  getEditServicePage : async(req,res)=>{
    try{
      const {serviceId} = req.params;
      const service = await Service.findById(serviceId);
      if(!service){
        return res.status(404).send('Service not found');
      }
      console.log(service.serviceFeatures);
      console.log(service.serviceImage);
      res.render('admin/editservice',{service})
    }catch(error){
      console.log("error : ",error);
    }
  },

  editService : async(req,res)=>{
    try{
      const {serviceId} = req.params;
      const{
        serviceTitle,
        serviceName,
        serviceDescription,
        serviceFeatures,
      } = req.body;
      const service = await Service.findById(serviceId);
      service.servicetitle = serviceTitle;
      service.serviceName = serviceName;
      service.serviceDescription = serviceDescription;
      service.serviceFeatures = JSON.parse(serviceFeatures);
      if(req.file){
        service.serviceImage = req.file.filename;
      }
      
      await service.save();

      res.json({message : 'service edited successfully'})
    }catch(error){
      console.log(error);
      res.status(500).json({error : 'Error updating service'});
    }
  },

  deleteService : async(req,res)=>{
    try{
      const serviceId = req.params.serviceId;
      await Service.findByIdAndRemove(serviceId);
      res.json({message : 'Service deleted successfully'});
    }catch(error){
      console.error(error);
      res.status(500).json({error : 'An error occured while deleting'})
    }
  },

  getReviewsPage: async (req, res) => {
    try {
      const reviews = await Reviews.find();
      res.render("admin/reviews",{reviews});
    } catch (error) {
      res.status(500).json({ error: "error fetching services", error });
    }
  },

  toggleReview : async(req,res)=>{
    try{
      const {reviewId} = req.body;
      const review = await Reviews.findById(reviewId);
      if(!review){
        return res.status(404).send('Review not found');
      }
      review.addtouserpage = !review.addtouserpage;
      await review.save();
      res.status(200).send('Review toggled successfully')
    }catch(error){
      console.error(error);
      res.status(500).send('Internal server error');
    }
  },

  deleteReview : async(req,res)=>{
    const reviewId = req.params.reviewId;
    try{
      const deletedReview = await Reviews.findByIdAndRemove(reviewId);
      if(deletedReview){
        res.json({message : 'Review deleted successfully'});
      }else{
        res.status(404).json({error : 'Review not found'});
      }
    }catch(error){
      console.error(error);
      res.status(500).json({error : 'An error occured while deleting the review'});
    }
  },

  getLoginPage : async(req,res)=>{
    try{
      res.render('admin/signin');
    }catch(error){
      console.error(error);
    }
  },

  adminLogin : async(req,res)=>{
    const {email, password} = req.body;
    try{
      const admin = await Admin.findOne({email});
      if(!admin){
        return res.status(400).json({errors : {email : 'Admin not found'}});
      }
      const passwordMatch = await bcrypt.compare(password,admin.password);
      if(!passwordMatch){
        return res.status(400).json({errors: {password : 'Incorrect password'}});
      }
      const token = createToken(admin._id);
      res.cookie('greenx',token,{httpOnly : true, maxAge : maxAge * 1000});
      res.status(201).json({admin});
    }catch(error){
      const errors = handleErrors(err);
      res.status(400).json({errors})
    }
  },

  getSignupPage : async(req,res)=>{
    try{
      res.render('admin/signup');
    }catch(error){
      console.error(error);
    }
  },

  adminSignUp : async(req,res)=>{
    const {email , password} = req.body;
    try{
      const existingAdmin = await Admin.findOne({email});
      if(existingAdmin){
        res.status(400).json({message : 'admin with this email already existed'});
      }
      const newAdmin = new Admin({
        email,
        password
      });
      await newAdmin.save();
      const token = createToken(newAdmin._id);
      res.cookie('greenx',token,{httpOnly : true, maxAge : maxAge * 1000});
      res.status(201).json({user : newAdmin._id});
    }catch(err){
      const errors = handleErrors(err);
      res.status(400).json({errors})
    }
  },

  getLogout : async(req,res)=>{
    res.cookie('greenx',' ',{maxAge : 1});
    res.redirect('/admin');
  },

  getForgotPasswordPage : async(req,res)=>{
    try{
      res.render('admin/forgotpassword')
    }catch(error){
      console.log(error);
    }
  },

  adminForgotPassword : async(req,res)=>{
    const {email} = req.body;
    try{
      const admin = await Admin.findOne({email});
      if(!admin){
        return res.status(404).json({message : 'Admin not found'});
      }
      const token = crypto.randomBytes(20).toString('hex');
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours()+1);
      admin.resetPasswordToken = token;
      admin.resetPasswordExpires = expirationDate;
      await admin.save();

      const resetLink = `http://greenxpcs.com/admin/reset-password/${token}`;
      const mailOptions = {
        from : 'greenxpcs@gmail.com',
        to : email,
        subject : 'Password Reset Request',
        text : `You are recieving this email because you (or someone else) has request a password reset for your account. Please click on the following link to reset your password : ${resetLink}`
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({message : 'check your mail and get the link'});
    }catch(error){
      console.error(error);
      res.status(500).json({message : 'Failed to send password reset email'});
    }
  },

  passwordReset : async(req,res)=>{
    const {token} = req.params;
    try{
      const admin = await Admin.findOne({
        resetPasswordToken : token,
        resetPasswordExpires : {$gt:Date.now()}
      });
      if(!admin){
        return res.status(400).json({message : 'Passsword reset link is invalid or expired'});
      }
      res.render('admin/resetpassword',{token});
    }catch(error){
      console.error(error);
      res.status(500).json({message : 'failed to load reset password page'})
    }
  },

  postPasswordReset : async(req,res)=>{
    const {token} = req.params;
    const {newPassword} = req.body;
    console.log(token,'ugvuh');
    try{
      const admin = await Admin.findOne({
        resetPasswordToken : token,
        resetPasswordExpires : {$gt:Date.now()}
      });
      if(!admin){
        return res.status(400).json({message : 'Password reset link is invalid or expired'});
      }
      admin.password = newPassword;
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      res.status(200).json({message : 'Password reset successful'});
    }catch(error){
      console.error(error);
      res.status(500).json({message : 'Failed to reset password'});
    }
  },

  getGalleryPage : async(req,res)=>{
    try{
      const images = await Gallery.find({},'image name');
      res.render('admin/gallery',{images});
    }catch(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },

  getAddPhotoPage : async(req,res)=>{
    try{
      res.render('admin/addphoto')
    }catch(error){
      console.log(error);
    }
  },

  postAddPhoto: async (req, res) => {
    try {
        const { imageName } = req.body;
        const image = req.file ? req.file.filename : null;
        const newGallery = new Gallery({
            image: image,
            name: imageName,
        });
        await newGallery.save();
        res.json({ message: "photo added successfully" });
    } catch (error) {
        console.log(error);
    }
},

deleteImage : async(req,res)=>{
    const imageId = req.params.id;
    try{
      const deletedImage = await Gallery.findByIdAndRemove(imageId);
      if(!deletedImage){
        return res.json({success : false, message : "Image not found"});
      }
      return res.json({success : true, message : "Image deleted successfully"});
    }catch(err){
      console.error(err);
      return res.json({success : false, message : "Failed to delete the image"});
    }
  }
}





