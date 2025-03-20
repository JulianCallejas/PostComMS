import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createLogger } from '../../lib/createLogger';
import { config } from '../../config';
import authRoutes from './index';

//Logger
const logger = createLogger('authservice');

const app = express();

app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    logger.error(`Error en el servidor: ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  } else {
    next();
  }
});

const port = config.authPort;

app.listen(port, () => {
  logger.info(`Auth service running on port ${port}`);
});
