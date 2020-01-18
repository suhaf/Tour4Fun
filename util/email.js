const nodemailer = require('nodemailer');

const sendEmail = async options => {
//    1) create transporter

    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            // should be replaced with real sender's account
            user:"874292db008e11",
            pass:"2817e65f2bddbb"
        }
    });

//    2) define the email 
    let mailOptions = {
        // should be replaced with real recipient's account
        from: 'admin <admin@xjz.com>',
        to: options.email,
        subject: options.subject, 
        text: options.message
    };

//    3) send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;
