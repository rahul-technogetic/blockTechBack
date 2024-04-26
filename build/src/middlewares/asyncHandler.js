"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (routeHandler) => {
    return (req, res, next) => {
        Promise.resolve(routeHandler(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
