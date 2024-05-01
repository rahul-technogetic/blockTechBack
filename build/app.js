"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const config_1 = require("./config/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: config_1.config.frontendDomain,
}));
app.get("/", (req, res, next) => {
    res.json({ message: "BlockTech Running" });
});
app.use('/api/users', userRouter_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map