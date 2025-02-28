import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true", // Convert string to boolean
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"ZEFTON" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export default sendEmail;
