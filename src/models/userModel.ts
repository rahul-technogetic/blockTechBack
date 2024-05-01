import mongoose from "mongoose";
import { User } from "../types/userTypes";

const userSchema = new mongoose.Schema<User>(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: { type: String, enum: ['admin', 'user', 'account manager', 'property manager'], default: 'user' },
    },
    { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);