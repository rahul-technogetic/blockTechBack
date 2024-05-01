"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const DOMAIN = "sandbox90c1c47a231c4f04a05fd5d627d005ad.mailgun.org";
const mg = (0, mailgun_js_1.default)({
    apiKey: "ecbd0194dca6181c5208a8c90642ee0c-86220e6a-eae6cac0",
    domain: DOMAIN,
});
const sendEmail = async (to, subject, text) => {
    try {
        const data = {
            from: "Mailgun Sandbox <postmaster@sandbox90c1c47a231c4f04a05fd5d627d005ad.mailgun.org>",
            to,
            subject,
            text,
        };
        await mg.messages().send(data);
        console.log("Email sent successfully");
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailSender.js.map