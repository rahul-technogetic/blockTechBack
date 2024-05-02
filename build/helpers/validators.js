"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationResult = exports.loginValidationArray = exports.registrationValidationArray = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
exports.registrationValidationArray = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 16 }).withMessage('Password must be between 6 and 16 characters long')
        .custom((value, { req }) => {
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
            throw (0, http_errors_1.default)(400, "Password must contain both uppercase and lowercase characters");
        }
        return true;
    }),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];
exports.loginValidationArray = [
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 16 }).withMessage('Password must be at most 16 characters long'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];
const handleValidationResult = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = (0, http_errors_1.default)(400, "Invalide Request", { details: errors.array() });
        return next(error);
    }
    else {
        return next();
    }
};
exports.handleValidationResult = handleValidationResult;
//# sourceMappingURL=validators.js.map