import nodemailer from "nodemailer";

//configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'EMAIL',
        pass: 'EMAIL_PASSWORD'
    }
});

const sendEmail = async(recipient, subject, text) => {
    const mailOptions = {
        from: 'EMAIL',
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

