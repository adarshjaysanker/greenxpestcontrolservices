var express = require('express');
var router = express.Router();
const {
    getHomePage,
    getContactPage,
    getServicePage,
    submitReview,
    sendMessage,
    searchData
} = require('../controllers/usercontrollers')

/* GET users listing. */
router.get('/',getHomePage);
router.get('/contact',getContactPage);
router.get('/services/:serviceTitle',getServicePage);
router.post('/submitreview',submitReview);
router.post('/sendmessage',sendMessage);
router.post('/searchdata',searchData)


module.exports = router;
