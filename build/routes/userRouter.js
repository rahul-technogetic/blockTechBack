"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const validators_1 = require("../helpers/validators");
const userRouter = express_1.default.Router();
userRouter.post("/register", validators_1.registrationValidationArray, validators_1.handleValidationResult, userControllers_1.createUser);
userRouter.post("/login", validators_1.loginValidationArray, validators_1.handleValidationResult, userControllers_1.loginUser);
userRouter.post("/forgot-password", userControllers_1.forgetPassword);
userRouter.post("/reset-password/:id/:token", userControllers_1.resetPassword);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map