import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { User } from "../types/userTypes";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { config } from "../config/config";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import nodemailer from 'nodemailer'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = createHttpError(400, "Invalide Request", { details: errors.array() });
        // res.send({ errors: errors.array() });
        return next(error);
    }

    const { name, username, email, password, role } = req.body;


    // check: if username already exists
    try {
        const user = await userModel.findOne({ username });
        if (user) {
            const error = createHttpError(
                400,
                "User already exists with this username, try to enter a Unique one."
            );
            return next(error);
        }
    } catch (err) {
        return next(createHttpError(500, "Error while getting user"));
    }
    // check: if email already exists
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            const error = createHttpError(
                400,
                "User already exists with this email."
            );
            return next(error);
        }
    } catch (err) {
        return next(createHttpError(500, "Error while getting user"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User;
    try {
        newUser = await userModel.create({
            name,
            email,
            username,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: "User Created, Now Login with your Credentials!" });
    } catch (err) {
        return next(createHttpError(500, "Server issue while creating user."));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = createHttpError(400, "Invalide Request", { details: errors.array() });
        // res.send({ errors: errors.array() });
        return next(error);
    }

    const { username, email, password } = req.body;


    try {
        const userName = await userModel.findOne({ username });
        if (!userName) {
            return next(createHttpError(404, "User not found with this UserName."));
        }

        // Check: Email vali...
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(createHttpError(404, "User not found with this Email."));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // Check: Pass Valid vali...
        if (!isMatch) {
            return next(createHttpError(400, "Password incorrect!"));
        }

        // token
        const token = sign({ sub: user._id, role: user.role, username }, config.jwtSecret as string, {
            expiresIn: "7d", // Login Timeout: Token Expires after 7 days.. done
            algorithm: "HS256",
        });

        res.json({ accessToken: token });
    } catch (err) {
        return next(createHttpError(500, "Server issue while user login."));
    }
};

const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const oldUser = await userModel.findOne({ email });
        if (!oldUser) {
            return next(createHttpError(404, "User not found."));
        }
        const secret = config.jwtSecret + oldUser.password;
        const token = sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "10m",
            algorithm: "HS256"
        });
        const link = `${config.frontendDomain}/reset-password/${oldUser._id}/${token}`;
        // MailTrap as Host(Dev..)
        var transporter = nodemailer.createTransport({
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
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "mail sent", url: link });
            }
        });
        // console.log(link);
    } catch (error) {
        return next(createHttpError(500, "Server issue while Forgot Password."));
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.params;
    const { password } = req.body;
    if (!password || password === "") {
        return next(createHttpError(404, "No Password Input."));
    }

    const oldUser = await userModel.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = config.jwtSecret + oldUser.password;
    try {
        const verifyy = verify(token, secret) as JwtPayload;
        const encryptedPassword = await bcrypt.hash(password, 10);
        await userModel.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );

        res.status(201).json({ message: "Password reset done", email: verifyy.email, status: "verified" });
    } catch (error) {
        return next(createHttpError(500, "Server issue while Reseting the Password."));
    }
}

export { createUser, loginUser, forgetPassword, resetPassword };