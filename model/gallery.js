const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({

    image : {
        type : String
    },

    name : {
        type : String
    }
});

const gallery = mongoose.model('gallery', gallerySchema);
module.exports = gallery;