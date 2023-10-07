const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({

    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    }
},{
    timestamps: true
});

adminSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

module.exports = mongoose.model('Admin',adminSchema);