const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    name : {
        type : String
    },

    email : {
        type : String
    },
    review : {
        type : String
    },
    addtouserpage : {
        type : Boolean,
        default : false
    }
});

const Reviews = mongoose.model('Reviews',reviewSchema);
module.exports = Reviews;