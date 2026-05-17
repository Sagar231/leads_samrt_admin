"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const user_model_1 = require("../modules/auth/user.model");
const lead_model_1 = require("../modules/leads/lead.model");
const lead_types_1 = require("../modules/leads/lead.types");
const logger_1 = require("../utils/logger");
const SAMPLE_NAMES = [
    'Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Ananya Singh', 'Vikram Reddy',
    'Isha Mehta', 'Karthik Iyer', 'Neha Gupta', 'Arjun Nair', 'Diya Joshi',
    'Rahul Kumar', 'Sanya Kapoor', 'Aditya Rao', 'Meera Pillai', 'Sahil Khan',
    'Pooja Desai', 'Yash Agarwal', 'Tanvi Bose', 'Nikhil Bhat', 'Riya Malhotra',
];
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
async function run() {
    await (0, db_1.connectDB)();
    // Wipe collections (dev only)
    await Promise.all([user_model_1.User.deleteMany({}), lead_model_1.Lead.deleteMany({})]);
    logger_1.logger.info('Cleared User and Lead collections');
    const passwordHash = await bcryptjs_1.default.hash('Password123!', 12);
    const [admin, sales] = await user_model_1.User.create([
        { name: 'Admin User', email: 'admin@example.com', passwordHash, role: 'admin' },
        { name: 'Sales User', email: 'sales@example.com', passwordHash, role: 'sales' },
    ]);
    logger_1.logger.info('Created users', { admin: admin.email, sales: sales.email });
    const leads = SAMPLE_NAMES.map((name, i) => ({
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}${i}@example.com`,
        status: pick(lead_types_1.LEAD_STATUSES),
        source: pick(lead_types_1.LEAD_SOURCES),
        ownerId: i % 2 === 0 ? admin._id : sales._id,
    }));
    await lead_model_1.Lead.insertMany(leads);
    logger_1.logger.info(`Inserted ${leads.length} leads`);
    await (0, db_1.disconnectDB)();
    await mongoose_1.default.connection.close();
}
run()
    .then(() => {
    logger_1.logger.info('Seed complete');
    process.exit(0);
})
    .catch((err) => {
    logger_1.logger.error('Seed failed', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map