import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import createHttpError from "http-errors";

export const registrationValidationArray = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 16 }).withMessage('Password must be between 6 and 16 characters long')
        .custom((value, { req }) => {
            if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
                throw createHttpError(400, "Password must contain both uppercase and lowercase characters");
            }
            return true;
        }),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];

export const loginValidationArray = [
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 16 }).withMessage('Password must be at most 16 characters long'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];

export const handleValidationResult = (req: Request, res: Response, next: NextFunction) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = createHttpError(400, "Invalide Request", { details: errors.array() });
        // res.send({ errors: errors.array() });
        return next(error);
    } else {
        return next()
    }

}