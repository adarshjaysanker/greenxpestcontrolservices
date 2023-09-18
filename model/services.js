const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({

    servicetitle : {
        type : String
    },

    serviceName : {
        type : String,
       
    },
    serviceDescription : {
        type : String,
       
    },
    serviceFeatures :{
        type : String
    },
    servicePrice : {
        type : String,
    },
    serviceImage : {
        type : String,
    }


});

const Service = mongoose.model('Service',servicesSchema);
module.exports = Service;