"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, source = 'body') => (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        next(result.error);
        return;
    }
    // Replace the source with the parsed (and coerced) value
    req[source] = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map