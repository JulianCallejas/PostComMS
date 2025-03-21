import express from 'express';
import cors from 'cors';
import { config } from '../../config';
import { authenticateToken } from '../../middleware/auth';
import { createLogger } from '../../lib/createLogger';
import postRoutes from './index';

//Logger
const logger = createLogger('postsservice');

const app = express();

app.use(cors());
app.use(express.json());

//Global middleware
app.use(authenticateToken);

app.use('/api/posts', postRoutes);


app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'posts' });
});

const port = config.postPort;


app.listen(port, () => {
    logger.info(`Post service running on port ${port}`);
});