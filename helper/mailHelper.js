const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD, FROM_MAIL } = require('../config/constant.js');

module.exports = {
    async kycVerified(mail) {
     
        console.log(EMAIL_USER, EMAIL_PASSWORD, mail);
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'minuteman4200@gmail.com',
                    pass: 'Qwerty@123'
                }
            });


            const message = {
                from: FROM_MAIL,
                to:mail,
                subject: 'Kyc Verified',
                html: '<h1>KYC Verified</h1><p>Your Kyc is verified</p>',
            };

            let approved = await transporter.sendMail(message);
            console.log(approved);
        }
        catch (e) {
            throw (e);
        }
    },

    async kycRejected(mail) {
        const testAccount = await nodemailer.createTestAccount();
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'minuteman4200@gmail.com',
                    pass: 'Qwerty@123'
                }
            });


            const message = {
                from: FROM_MAIL,
                to: mail,
                subject: 'Kyc Not Verified',
                html: '<h1>KYC Documents Rejected</h1><p>Your Kyc documents are rejected</p>',
            };

            let approved = await transporter.sendMail(message);
            console.log(approved);
        }
        catch (e) {
            throw (e);
        }
    },

    async sendResetPass(mail,url,token) {
     
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'minuteman4200@gmail.com',
                    pass: 'Qwerty@123'
                }
            });
            const message = {
                from: FROM_MAIL,
                to: mail,
                subject: 'Reset Password',
                html: `<h1>Reset your password</h1><p>Reset your password from <a href=${url}/forgotPassword?token=${token}>here</a></p>`,
            };

            let approved = await transporter.sendMail(message);
            console.log(approved);
        }
        catch (e) {
            throw (e);
        }
    }   
}

