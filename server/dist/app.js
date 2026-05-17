"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const error_1 = require("./middleware/error");
const auth_routes_1 = require("./modules/auth/auth.routes");
const leads_routes_1 = require("./modules/leads/leads.routes");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CLIENT_ORIGIN.split(',').map((o) => o.trim()),
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    if (env_1.env.NODE_ENV !== 'test') {
        app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
    }
    // Health
    app.get('/api/health', (_req, res) => {
        res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } });
    });
    // Routes
    app.use('/api/auth', auth_routes_1.authRouter);
    app.use('/api/leads', leads_routes_1.leadsRouter);
    // 404 + errors
    app.use(error_1.notFoundHandler);
    app.use(error_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map