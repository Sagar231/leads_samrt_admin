"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function log(level, message, meta) {
    const ts = new Date().toISOString();
    const line = `[${ts}] [${level.toUpperCase()}] ${message}`;
    if (meta !== undefined) {
        console[level === 'debug' ? 'log' : level](line, meta);
    }
    else {
        console[level === 'debug' ? 'log' : level](line);
    }
}
exports.logger = {
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
};
//# sourceMappingURL=logger.js.map