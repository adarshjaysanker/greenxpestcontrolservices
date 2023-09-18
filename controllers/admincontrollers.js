var express = require("express");
var router = express.Router();
const Service = require("../model/services");
// const upload = require('../middlewares/multer');
// const uploadServiceImage = upload.single('serviceImage');

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
      const { serviceName, serviceDescription, serviceFeatures, servicePrice , serviceTitle } =
        req.body;
      const serviceImage = req.file ? req.file.filename : null;
      const newService = new Service({
        servicetitle : serviceTitle,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        serviceFeatures: serviceFeatures,
        servicePrice: servicePrice,
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
};
