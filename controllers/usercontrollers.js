var express = require("express");
var router = express.Router();
const Service = require("../model/services");

module.exports = {

    getHomePage : async(req,res)=>{
        res.render('user/index');
    },

    getContactPage : async(req,res)=>{
        res.render('user/contact');
    },

   getServicePage : async(req,res)=>{
    try{
        const servicetitle = req.params.serviceTitle;
        const service = await Service.findOne({servicetitle});
        if(!service){
            return res.status(404).send('service not found');
        }
        res.render('user/services',{service})
    }catch(error){
        console.error(error);
        res.status(500).send('Internal server error');
    }
   },
}