import express from "express";
import { createUser, forgetPassword, loginUser, resetPassword } from "../controllers/userControllers";
import { handleValidationResult, loginValidationArray, registrationValidationArray } from "../helpers/validators";

const userRouter = express.Router();



userRouter.post("/register", registrationValidationArray, handleValidationResult, createUser);
userRouter.post("/login", loginValidationArray, handleValidationResult, loginUser);
userRouter.post("/forgot-password", forgetPassword);
userRouter.post("/reset-password/:id/:token", resetPassword);

export default userRouter;