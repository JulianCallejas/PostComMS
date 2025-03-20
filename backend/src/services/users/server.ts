import express from 'express';
import cors from 'cors';
import { config } from '../../config';
import { createLogger } from '../../lib/createLogger';
import { authenticateToken } from '../../middleware/auth';
import userRoutes from './index';


//Logger
const logger = createLogger('userservice');


const app = express();

app.use(cors());
app.use(express.json());

//Global middleware
app.use(authenticateToken);

app.use('/api/users', userRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'users' });
});

const port = config.userPort;


app.listen(port, () => {
    logger.info(`User service running on port ${port}`);
  });