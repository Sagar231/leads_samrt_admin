import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../modules/auth/user.model';
import { Lead } from '../modules/leads/lead.model';
import { LEAD_SOURCES, LEAD_STATUSES } from '../modules/leads/lead.types';
import { logger } from '../utils/logger';

const SAMPLE_NAMES = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Ananya Singh', 'Vikram Reddy',
  'Isha Mehta', 'Karthik Iyer', 'Neha Gupta', 'Arjun Nair', 'Diya Joshi',
  'Rahul Kumar', 'Sanya Kapoor', 'Aditya Rao', 'Meera Pillai', 'Sahil Khan',
  'Pooja Desai', 'Yash Agarwal', 'Tanvi Bose', 'Nikhil Bhat', 'Riya Malhotra',
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run(): Promise<void> {
  await connectDB();

  // Wipe collections (dev only)
  await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);
  logger.info('Cleared User and Lead collections');

  const passwordHash = await bcrypt.hash('Password123!', 12);
  const [admin, sales] = await User.create([
    { name: 'Admin User', email: 'admin@example.com', passwordHash, role: 'admin' },
    { name: 'Sales User', email: 'sales@example.com', passwordHash, role: 'sales' },
  ]);
  logger.info('Created users', { admin: admin.email, sales: sales.email });

  const leads = SAMPLE_NAMES.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}${i}@example.com`,
    status: pick(LEAD_STATUSES),
    source: pick(LEAD_SOURCES),
    ownerId: i % 2 === 0 ? admin._id : sales._id,
  }));
  await Lead.insertMany(leads);
  logger.info(`Inserted ${leads.length} leads`);

  await disconnectDB();
  await mongoose.connection.close();
}

run()
  .then(() => {
    logger.info('Seed complete');
    process.exit(0);
  })
  .catch((err) => {
    logger.error('Seed failed', err);
    process.exit(1);
  });
