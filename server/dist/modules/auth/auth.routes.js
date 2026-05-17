"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const auth_validators_1 = require("./auth.validators");
const auth_controller_1 = require("./auth.controller");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', (0, validate_1.validate)(auth_validators_1.registerSchema), auth_controller_1.registerHandler);
exports.authRouter.post('/login', (0, validate_1.validate)(auth_validators_1.loginSchema), auth_controller_1.loginHandler);
exports.authRouter.get('/me', auth_1.requireAuth, auth_controller_1.meHandler);
//# sourceMappingURL=auth.routes.js.map