import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { registerRoutes } from '../routes/index.js';
import type { AppConfig } from './config.js';
import { createLogger } from './logger.js';

export async function createServer(config: AppConfig): Promise<Express> {
  const app = express();
  const logger = createLogger(config);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

  registerRoutes(app);

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    logger.error({ err }, 'Unhandled error');
    res.status(500).json({ error: 'Internal Server Error' });
    next(err);
  });

  return app;
}
