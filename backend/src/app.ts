import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
