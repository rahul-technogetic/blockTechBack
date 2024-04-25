import express from "express";
import { createUser, forgetPassword, loginUser, resetPassword } from "./userControllers";
import { body } from 'express-validator'

const userRouter = express.Router();

const registrationValidationArray = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 16 }).withMessage('Password must be between 6 and 16 characters long')
        .custom((value, { req }) => { 
            if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
                throw new Error('Password must contain both uppercase and lowercase characters');
            }
            return true;
        }),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('role').trim().notEmpty().withMessage('Role is required'),
];

const loginValidationArray = [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long'),
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ max: 16 }).withMessage('Password must be at most 16 characters long'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
  ];
  


userRouter.post("/register",registrationValidationArray, createUser);
userRouter.post("/login", loginValidationArray, loginUser);
userRouter.post("/forgot-password", forgetPassword);
userRouter.post("/reset-password/:id/:token", resetPassword);

export default userRouter;