"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const auth_types_1 = require("./auth.types");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(80),
    email: zod_1.z.string().trim().toLowerCase().email(),
    password: zod_1.z.string().min(8).max(100),
    role: zod_1.z.enum(auth_types_1.USER_ROLES).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email(),
    password: zod_1.z.string().min(1),
});
//# sourceMappingURL=auth.validators.js.map