// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: "4357750a7f8c49",
//                 pass: "93324c3550c42c"
//             }
//         });

//         const mailOptions = {
//             from: "your-email@gmail.com",
//             to,
//             subject,
//             text,
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email sent: " + info.response);
//         return true;
//     } catch (error) {
//         console.error("Error sending email:", error);
//         return false;
//     }
// };

import mailgun from "mailgun-js";

const DOMAIN = "sandbox90c1c47a231c4f04a05fd5d627d005ad.mailgun.org";
const mg = mailgun({
    apiKey: "ecbd0194dca6181c5208a8c90642ee0c-86220e6a-eae6cac0",
    domain: DOMAIN,
});

export const sendEmail = async (to, subject, text) => {
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
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
