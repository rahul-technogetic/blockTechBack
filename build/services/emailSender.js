"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "4357750a7f8c49",
                pass: "93324c3550c42c"
            }
        });
        const mailOptions = {
            from: "your-email@gmail.com",
            to,
            subject,
            text,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailSender.js.map