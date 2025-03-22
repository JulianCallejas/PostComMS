import express from 'express';
import cors from 'cors';
import { config } from '../../config';
import { authenticateToken } from '../../middleware/auth';
import { createLogger } from '../../lib/createLogger';
import postRoutes from './index';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '../../swagger/posts/swagger.config';

//Logger
const logger = createLogger('postsservice');

const app = express();
app.use(cors());

//Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());

app.use('/api/posts', authenticateToken, postRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'posts' });
});

const port = config.postPort;

app.listen(port, () => {
    logger.info(`Post service running on port ${port}`);
});