import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
    path: '../.env'
});

//configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async(recipient, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: recipient,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending email", error);
    }
};

export {sendEmail};

