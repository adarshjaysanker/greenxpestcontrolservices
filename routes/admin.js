var express = require("express");
var router = express.Router();
const upload = require("../middlewares/multer");

const {
  getAdminDashboard,
  getServicePage,
  addService,
  getAddServicePage,
} = require("../controllers/admincontrollers");

/* GET home page. */
router.get("/", getAdminDashboard);
router.get("/services", getServicePage);
router.post("/addservice", upload.single("serviceImage"), addService);
router.get("/getaddservicepage", getAddServicePage);

module.exports = router;
