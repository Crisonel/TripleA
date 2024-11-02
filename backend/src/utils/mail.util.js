import nodemailer from "nodemailer";

//configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'ssj6713@shivedaleschool.com',
        pass: 'Halka@123'
    }
});

const sendEmail = async(recipient, subject, text) => {
    const mailOptions = {
        from: 'ssj6713@shivedaleschool.com',
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

