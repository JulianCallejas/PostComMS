import express from 'express';
import cors from 'cors';
import { config } from '../../config';
import { createLogger } from '../../lib/createLogger';
import { authenticateToken } from '../../middleware/auth';
import userRoutes from './index';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '../../config/swagger/users/swagger.config';

//Logger
const logger = createLogger('userservice');
const app = express();
app.use(cors());

//Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/api/users', authenticateToken, userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'users' });
});

const port = config.userPort;

app.listen(port, () => {
  logger.info(`User service running on port ${port}`);
});