import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import aiRoutes from './routes/aiRoutes';
import newsRoutes from './routes/newsRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Vehicles and Inventory routes
app.use('/api/vehicles', vehicleRoutes);

// AI Concierge routes
app.use('/api/ai', aiRoutes);

// Automotive News routes
app.use('/api/news', newsRoutes);

export default app;
