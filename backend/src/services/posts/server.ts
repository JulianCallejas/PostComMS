import express from 'express';
import cors from 'cors';
import { config } from '../../config';
import { authenticateToken } from '../../middleware/auth';
import postRoutes from './index';

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
    console.log(`Post service running on port ${port}`);
});