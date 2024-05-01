"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _confiq = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_URI,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    frontendDomain: process.env.FRONTEND_DOMAIN,
};
exports.config = Object.freeze(_confiq);
//# sourceMappingURL=config.js.map