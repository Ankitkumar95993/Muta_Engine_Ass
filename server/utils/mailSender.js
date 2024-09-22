const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body, attachments = []) => {

    console.log('Received email address:', email);
    console.log('Received title:', title);
    console.log('Received body:', body);
    console.log('Received attachments:', attachments);


    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });

            let info = await transporter.sendMail({
                from: '"MutaEngine || FastLearning - by Ankit" <' + process.env.MAIL_USER + '>',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
                attachments: attachments
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.error('Detailed email error:', error);
        throw error;
    }
}


module.exports = mailSender;