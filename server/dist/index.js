"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    await (0, db_1.connectDB)();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server listening on http://localhost:${env_1.env.PORT}`);
    });
    const shutdown = (signal) => {
        logger_1.logger.info(`Received ${signal}, shutting down...`);
        server.close(() => {
            logger_1.logger.info('HTTP server closed');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    logger_1.logger.error('Failed to start server', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map