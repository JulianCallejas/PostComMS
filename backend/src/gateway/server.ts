import express, { Request, Response } from 'express'; 
import cors from 'cors';
import { config } from '../config';
import { createLogger } from '../lib/createLogger';

//Logger
const logger = createLogger('gateway');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de depuración
app.use((req, res, next) => {
  console.log(`Gateway recibió: ${req.method} ${req.url}`);
  next();
});


// Health check endpoint
app.get('/health', (_req: Request, res: { json: (arg0: any) => void; }) => {
  res.json({ status: 'ok', service: 'gateway' });
});

const port = config.port;
app.listen(port, () => {
  logger.info(`✅ API Gateway corriendo en el puerto ${port}`);
});