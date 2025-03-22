import express, { Request, Response } from 'express'; 
import cors from 'cors';
import { config } from '../config';
import { createLogger } from '../lib/createLogger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '../swagger/gateway/swagger.config';



//Logger
const logger = createLogger('gateway');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());
app.use(express.json());

// Middleware for debugging
app.use((req, res, next) => {
  console.log(`Gateway recibió: ${req.method} ${req.url}`);
  next();
});

// Proxy configuration for each service
const createServiceProxy = (serviceName: string, target: string) => {
  logger.info(`Configurando proxy para ${serviceName} en ${target}`);
  return createProxyMiddleware({
    target,
    pathFilter: `/api/${serviceName}`,
    changeOrigin: true,
    pathRewrite: { [`^/api/${serviceName}`]: `/api/${serviceName}` },
    on:{
      proxyReq: (proxyReq, req: Request) => {
        logger.info(`Proxying request - ${req.method} ${req.originalUrl} -> ${target}${req.originalUrl}`);
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: (err: Error, _req: Request, res: Response | any ) => {
        logger.error(`Error en proxy ${serviceName}: ${err.message}`);
        res.status(502).json({ error: 'Error en el proxy' });
      }
    },
  });
};

// Route traffic to appropriate services
app.use( createServiceProxy('auth', config.services.auth));
app.use( createServiceProxy('users', config.services.users));
app.use( createServiceProxy('posts', config.services.posts));


// Health check endpoint
app.get('/health', (_req: Request, res: { json: (arg0: any) => void; }) => {
  res.json({ status: 'ok', service: 'gateway' });
});

const port = config.port;
app.listen(port, () => {
  logger.info(`✅ API Gateway corriendo en el puerto ${port}`);
});