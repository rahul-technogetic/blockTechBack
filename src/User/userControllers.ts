import { NextFunction, Request, Response } from "express";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { User } from "./userTypes";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, email, password, role } = req.body;

    // client Input vali..

    // empty Case
    if (!name || !username || !email || !password || !role) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    // Password 
    if (password.length < 6 || password.length > 16) {
        const error = createHttpError(400, "Password must be at least 6 characters long and at most 16");
        return next(error);
    }
    // Case Validations in Pass..
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    if (!hasUppercase || !hasLowercase) {
        const error = createHttpError(400, "Password must contain both uppercase and lowercase characters");
        return next(error);
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = createHttpError(400, "Invalid email format");
        return next(error);
    }

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
    const { username, email, password } = req.body;

    // client Input vali..

    // empty Case
    if (!username || !email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }

    try {
        // Check: UserName vali...
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
            expiresIn: "7d", // Login Timeout: Token Expires after 7 days..
            algorithm: "HS256",
        });

        res.json({ accessToken: token });
    } catch (err) {
        return next(createHttpError(500, "Server issue while user login."));
    }
};

export { createUser, loginUser };