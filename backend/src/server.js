import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { connectDB, dbState } from './database/db.js';
import { initializeSocket } from './services/socketService.js';
import { startSensorSimulator } from './services/sensorSimulator.js';
import { executeAgentCycle } from './agents/agentLoop.js';
import { seedDatabase } from './seed/seedData.js';
import { Farmer } from './models/Farmer.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import schemesRoutes from './routes/schemesRoutes.js';
import financesRoutes from './routes/financesRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});
initializeSocket(io);

// Security & Utility Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health & System Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'KisanAI – Autonomous Farm Operations System',
    hackathon: 'Agentic AI × SDG Hackathon',
    database: {
      connected: dbState.isConnected,
      engine: dbState.isInMemory ? 'In-Memory Fallback' : 'Real MongoDB',
      serverType: dbState.serverType
    },
    sdgs: ['SDG 2: Zero Hunger', 'SDG 12: Responsible Consumption', 'SDG 13: Climate Action'],
    timestamp: new Date()
  });
});

// Seed API endpoint for instant reset / reseed
app.post('/api/seed', async (req, res, next) => {
  try {
    const data = await seedDatabase();
    res.json({ success: true, message: 'Database seeded with 3 sample farms and workers', data });
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/finances', financesRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
async function startServer() {
  await connectDB();

  // Auto-seed if first run and no farmer exists
  try {
    const count = await Farmer.countDocuments();
    if (count === 0) {
      console.log('[Bootstrap] No existing farmers detected. Auto-seeding initial sample farms...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn('[Bootstrap] Auto-seed check failed:', err.message);
  }

  // Start IoT Sensor Generator
  const simInterval = Number(process.env.IOT_SIMULATION_INTERVAL_SEC) || 15;
  startSensorSimulator(simInterval);

  // Setup Agent Loop Cron Scheduler (Every 30 minutes: '*/30 * * * *')
  const cronExpr = process.env.AGENT_CRON_SCHEDULE || '*/30 * * * *';
  cron.schedule(cronExpr, async () => {
    console.log(`[CronScheduler] ⏰ Scheduled trigger: Running autonomous farm operations cycle...`);
    await executeAgentCycle();
  });
  console.log(`[AgentLoop] 🤖 Autonomous Agent cron scheduled with pattern: "${cronExpr}"`);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n🚨 [Port Conflict] Port ${PORT} is already in use by another instance.`);
      console.error(`👉 Solution: Stop any existing dev server before running npm run dev.\n`);
      process.exit(1);
    } else {
      console.error('[Server Error]', err);
    }
  });

  server.listen(PORT, () => {
    console.log(`===================================================================`);
    console.log(`🌾 KisanAI – Autonomous Farm Operations System Backend`);
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`🌱 SDG 2: Zero Hunger | SDG 12: Responsible Consumption | SDG 13: Climate Action`);
    console.log(`📡 Socket.io Real-time Event Server Ready`);
    console.log(`===================================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
