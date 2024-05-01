"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPassWord = void 0;
const genPassWord = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?{}[]";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};
exports.genPassWord = genPassWord;
//# sourceMappingURL=helpers.js.map