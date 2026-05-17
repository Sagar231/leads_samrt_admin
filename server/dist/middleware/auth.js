"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const ApiError_1 = require("../utils/ApiError");
const auth_service_1 = require("../modules/auth/auth.service");
function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        next(ApiError_1.ApiError.unauthorized('Missing or invalid Authorization header'));
        return;
    }
    const token = header.slice('Bearer '.length).trim();
    if (!token) {
        next(ApiError_1.ApiError.unauthorized('Missing token'));
        return;
    }
    try {
        const payload = (0, auth_service_1.verifyToken)(token);
        req.user = { id: payload.id, email: payload.email, role: payload.role };
        next();
    }
    catch (err) {
        next(err);
    }
}
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(ApiError_1.ApiError.unauthorized());
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(ApiError_1.ApiError.forbidden('Insufficient permissions'));
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map