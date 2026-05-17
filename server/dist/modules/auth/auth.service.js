"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.register = register;
exports.login = login;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const ApiError_1 = require("../../utils/ApiError");
const user_model_1 = require("./user.model");
const BCRYPT_ROUNDS = 12;
function signToken(payload) {
    const options = { expiresIn: env_1.env.JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, options);
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    }
    catch {
        throw ApiError_1.ApiError.unauthorized('Invalid or expired token');
    }
}
async function register(input) {
    const existing = await user_model_1.User.findOne({ email: input.email }).lean();
    if (existing) {
        throw ApiError_1.ApiError.conflict('Email already registered');
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, BCRYPT_ROUNDS);
    const user = await user_model_1.User.create({
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role ?? 'sales',
    });
    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
    return { user: user.toPublicJSON(), token };
}
async function login(input) {
    const user = await user_model_1.User.findOne({ email: input.email });
    if (!user) {
        throw ApiError_1.ApiError.unauthorized('Invalid credentials');
    }
    const ok = await user.comparePassword(input.password);
    if (!ok) {
        throw ApiError_1.ApiError.unauthorized('Invalid credentials');
    }
    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
    return { user: user.toPublicJSON(), token };
}
async function getCurrentUser(userId) {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw ApiError_1.ApiError.notFound('User not found');
    return user.toPublicJSON();
}
//# sourceMappingURL=auth.service.js.map