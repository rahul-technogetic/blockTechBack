import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { User } from "../types/userTypes";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { config } from "../config/config";
import createHttpError from "http-errors";
import { sendEmail } from "../services/emailSender";

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password } = req.body;

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
            password: hashedPassword,
        });
        res.status(201).json({ message: "User Created, Now Login with your Credentials!" });
    } catch (err) {
        return next(createHttpError(500, "Server issue while creating user."));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {


    const { email, password } = req.body;


    try {

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
        const token = sign({ sub: user._id, role: user.role }, config.jwtSecret as string, {
            expiresIn: "7d", // Login Timeout: Token Expires after 7 days.. done
        });

        user.accessToken = token;
        await user.save();

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
        });

        const subject = "Forgot Password";
        const link = `${config.frontendDomain}/reset-password/${oldUser._id}/${token}`;
        const text = `Hello ${oldUser?.name},\n\ To Reset password,\n\nPlease click on the following link to verify your account: ${link}\n\nBest regards,\nTeam BlockTech`;
        const emailSent = await sendEmail(email, subject, text);
        if (emailSent) {
            console.log("Email sent successfully");
            res.status(201).json({ message: "mail sent", url: link });
        } else {
            return next(createHttpError(500, "Error sending email!"));
        }
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
        return next(createHttpError(400, "User Not Exists!"));
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