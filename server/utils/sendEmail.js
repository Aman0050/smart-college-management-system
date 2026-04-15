const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    // Use environment variables if provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback: Generate a test account via Ethereal 
        // Great for development testing!
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log("⚠️ No SMTP credentials found in .env. Using Ethereal test email account.");
    }

    const message = {
        from: process.env.FROM_EMAIL || '"Smart College Admin" <noreply@smart.college>',
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    
    // If using Ethereal, log the URL to view the email
    if (info.messageId && !process.env.SMTP_HOST) {
        console.log("-----------------------------------------");
        console.log("✨ PREVIEW YOUR EMAIL (OTP) HERE: %s", nodemailer.getTestMessageUrl(info));
        console.log("-----------------------------------------");
    }
};

module.exports = sendEmail;
