import type { Express, Request, Response } from 'express';

export function registerRoutes(app: Express): void {
  app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Hello from the Tako Node service template!' });
  });

  app.get('/metrics', (_req: Request, res: Response) => {
    res.json({ uptime: process.uptime(), memoryUsage: process.memoryUsage() });
  });
}
