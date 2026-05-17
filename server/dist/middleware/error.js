"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
function notFoundHandler(req, _res, next) {
    next(ApiError_1.ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, _req, res, 
// next is required for Express to recognize this as an error handler
_next) {
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL';
    let details;
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
        details = err.details;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation error';
        code = 'VALIDATION_ERROR';
        details = err.flatten();
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = 'Validation error';
        code = 'VALIDATION_ERROR';
        details = err.errors;
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}`;
        code = 'BAD_REQUEST';
    }
    else if (typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate key';
        code = 'CONFLICT';
        details = err.keyValue;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    if (statusCode >= 500) {
        logger_1.logger.error(message, err);
    }
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            code,
            ...(details !== undefined ? { details } : {}),
            ...(env_1.env.NODE_ENV === 'development' && err instanceof Error
                ? { stack: err.stack }
                : {}),
        },
    });
}
//# sourceMappingURL=error.js.map