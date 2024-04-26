"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = (0, http_errors_1.default)(400, "Invalide Request", { details: errors.array() });
        // res.send({ errors: errors.array() });
        return next(error);
    }
    const { name, username, email, password, role } = req.body;
    // check: if username already exists
    try {
        const user = yield userModel_1.default.findOne({ username });
        if (user) {
            const error = (0, http_errors_1.default)(400, "User already exists with this username, try to enter a Unique one.");
            return next(error);
        }
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error while getting user"));
    }
    // check: if email already exists
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const error = (0, http_errors_1.default)(400, "User already exists with this email.");
            return next(error);
        }
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error while getting user"));
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    let newUser;
    try {
        newUser = yield userModel_1.default.create({
            name,
            email,
            username,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: "User Created, Now Login with your Credentials!" });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Server issue while creating user."));
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = (0, http_errors_1.default)(400, "Invalide Request", { details: errors.array() });
        // res.send({ errors: errors.array() });
        return next(error);
    }
    const { username, email, password } = req.body;
    try {
        const userName = yield userModel_1.default.findOne({ username });
        if (!userName) {
            return next((0, http_errors_1.default)(404, "User not found with this UserName."));
        }
        // Check: Email vali...
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return next((0, http_errors_1.default)(404, "User not found with this Email."));
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        // Check: Pass Valid vali...
        if (!isMatch) {
            return next((0, http_errors_1.default)(400, "Password incorrect!"));
        }
        // token
        const token = (0, jsonwebtoken_1.sign)({ sub: user._id, role: user.role, username }, config_1.config.jwtSecret, {
            expiresIn: "7d", // Login Timeout: Token Expires after 7 days.. done
            algorithm: "HS256",
        });
        res.json({ accessToken: token });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Server issue while user login."));
    }
});
exports.loginUser = loginUser;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const oldUser = yield userModel_1.default.findOne({ email });
        if (!oldUser) {
            return next((0, http_errors_1.default)(404, "User not found."));
        }
        const secret = config_1.config.jwtSecret + oldUser.password;
        const token = (0, jsonwebtoken_1.sign)({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "10m",
            algorithm: "HS256"
        });
        const link = `${config_1.config.frontendDomain}/reset-password/${oldUser._id}/${token}`;
        // MailTrap as Host(Dev..)
        var transporter = nodemailer_1.default.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "4357750a7f8c49",
                pass: "93324c3550c42c"
            }
        });
        const mailOptions = {
            from: "sanjay@gmail.com",
            to: `${email}`,
            subject: "Password Reset",
            text: link,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "mail sent", url: link });
            }
        });
        // console.log(link);
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Server issue while Forgot Password."));
    }
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const { password } = req.body;
    if (!password || password === "") {
        return next((0, http_errors_1.default)(404, "No Password Input."));
    }
    const oldUser = yield userModel_1.default.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = config_1.config.jwtSecret + oldUser.password;
    try {
        const verifyy = (0, jsonwebtoken_1.verify)(token, secret);
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        yield userModel_1.default.updateOne({
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
});
exports.resetPassword = resetPassword;
