const jwt = require('jsonwebtoken');
const Admin = require('../model/admin')

const requireAuth = (req,res,next) => {
    const token = req.cookies.greenx;
    if(token){
        jwt.verify(token,'greenxgreenxxxsecret',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/admin/login');
            }else{
                console.log(decodedToken);
                next();                
            }
        })
    }else{
        res.redirect('/admin/login')
    }
}

const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'greenxgreenxxxsecret',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let admin = await Admin.findById(decodedToken.id);
                res.locals.admin = admin;
                next();                
            }
        })
    }else{
        res.locals.admin = null;
        next();
    }
}

module.exports = {requireAuth , checkUser}