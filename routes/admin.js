var express = require("express");
var router = express.Router();
const upload = require("../middlewares/multer");
const {requireAuth , checkUser} = require('../middlewares/auth');


const {
  getAdminDashboard,
  getServicePage,
  addService,
  getAddServicePage,
  getEditServicePage,
  editService,
  deleteService,
  getReviewsPage,
  toggleReview,
  getLoginPage,
  adminLogin,
  getSignupPage,
  adminSignUp,
  getLogout,
  getForgotPasswordPage,
  adminForgotPassword,
  passwordReset,
  postPasswordReset,
  deleteReview,
  getGalleryPage,
  getAddPhotoPage,
  postAddPhoto
  
} = require("../controllers/admincontrollers");

/* GET home page. */
router.get("/",requireAuth,checkUser,getAdminDashboard);
router.get("/services",requireAuth,checkUser,getServicePage);
router.post("/addservice",requireAuth,upload.single("serviceImage"), addService);
router.get("/getaddservicepage",requireAuth,checkUser,getAddServicePage);
router.get('/geteditservice/:serviceId',requireAuth,checkUser,getEditServicePage);
router.post('/editservice/:serviceId',requireAuth,upload.single("serviceImage"),editService);
router.delete('/deleteservice/:serviceId',requireAuth,deleteService);
router.get('/reviews',requireAuth,checkUser,getReviewsPage);
router.post('/togglereview',requireAuth,toggleReview);
router.delete('/deletereview/:reviewId',deleteReview);
router.get('/gallery',getGalleryPage);
router.get('/getaddphotopage',getAddPhotoPage);
router.post('/addphoto',upload.single('image'),postAddPhoto)
router.get('/login',getLoginPage);
router.post('/login',adminLogin);
router.get('/signup',getSignupPage);
router.post('/signup',adminSignUp);
router.get('/logout',getLogout);






router.get('/forgotpassword',getForgotPasswordPage);
router.post('/forgotpassword',adminForgotPassword);
router.get('/reset-password/:token',passwordReset);
router.post('/resetpassword/:token',postPasswordReset)



module.exports = router;
