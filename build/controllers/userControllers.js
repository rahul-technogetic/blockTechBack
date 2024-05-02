"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.loginUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const http_errors_1 = __importDefault(require("http-errors"));
const emailSender_1 = require("../services/emailSender");
const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email });
        if (user) {
            const error = (0, http_errors_1.default)(400, "User already exists with this email.");
            return next(error);
        }
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error while getting user"));
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    let newUser;
    try {
        newUser = await userModel_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User Created, Now Login with your Credentials!" });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Server issue while creating user."));
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return next((0, http_errors_1.default)(404, "User not found with this Email."));
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return next((0, http_errors_1.default)(400, "Password incorrect!"));
        }
        const token = (0, jsonwebtoken_1.sign)({ sub: user._id, role: user.role }, config_1.config.jwtSecret, {
            expiresIn: "7d",
        });
        user.accessToken = token;
        await user.save();
        res.json({ accessToken: token });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Server issue while user login."));
    }
};
exports.loginUser = loginUser;
const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const oldUser = await userModel_1.default.findOne({ email });
        if (!oldUser) {
            return next((0, http_errors_1.default)(404, "User not found."));
        }
        const secret = config_1.config.jwtSecret + oldUser.password;
        const token = (0, jsonwebtoken_1.sign)({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "10m",
        });
        const subject = "Forgot Password";
        const link = `${config_1.config.frontendDomain}/reset-password/${oldUser._id}/${token}`;
        const text = `Hello ${oldUser === null || oldUser === void 0 ? void 0 : oldUser.name},\n\ To Reset password,\n\nPlease click on the following link to verify your account: ${link}\n\nBest regards,\nTeam BlockTech`;
        const emailSent = await (0, emailSender_1.sendEmail)(email, subject, text);
        if (emailSent) {
            console.log("Email sent successfully");
            res.status(201).json({ message: "mail sent", url: link });
        }
        else {
            return next((0, http_errors_1.default)(500, "Error sending email!"));
        }
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Server issue while Forgot Password."));
    }
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res, next) => {
    const { id, token } = req.params;
    const { password } = req.body;
    if (!password || password === "") {
        return next((0, http_errors_1.default)(404, "No Password Input."));
    }
    const oldUser = await userModel_1.default.findOne({ _id: id });
    if (!oldUser) {
        return next((0, http_errors_1.default)(400, "User Not Exists!"));
    }
    const secret = config_1.config.jwtSecret + oldUser.password;
    try {
        const verifyy = (0, jsonwebtoken_1.verify)(token, secret);
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        await userModel_1.default.updateOne({
            _id: id,
        }, {
            $set: {
                password: encryptedPassword,
            },
        });
        res.status(201).json({ message: "Password reset done", email: verifyy.email, status: "verified" });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Server issue while Reseting the Password."));
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=userControllers.js.map