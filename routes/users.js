var express = require('express');
var router = express.Router();
const {getHomePage , getContactPage , getServicePage} = require('../controllers/usercontrollers')

/* GET users listing. */
router.get('/',getHomePage);
router.get('/contact',getContactPage);
router.get('/services/:serviceTitle',getServicePage);


module.exports = router;
