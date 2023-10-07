const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'greenxpcs@gmail.com',
        pass : 'xtos prni bdgz vdgc'
    }
});

module.exports = transporter