"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationArray = exports.registrationValidationArray = void 0;
const express_validator_1 = require("express-validator");
exports.registrationValidationArray = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 16 }).withMessage('Password must be between 6 and 16 characters long')
        .custom((value, { req }) => {
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
            throw new Error('Password must contain both uppercase and lowercase characters');
        }
        return true;
    }),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('role').trim().notEmpty().withMessage('Role is required'),
];
exports.loginValidationArray = [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 16 }).withMessage('Password must be at most 16 characters long'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];
