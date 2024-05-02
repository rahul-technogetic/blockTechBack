"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
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
    accessToken: {
        type: String,
    },
    role: { type: String, enum: ['admin', 'user', 'account manager', 'property manager'], default: 'user' },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=userModel.js.map