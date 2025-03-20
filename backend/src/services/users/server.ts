import express from 'express';
import cors from 'cors';
import { config } from '../../config';
import { createLogger } from '../../lib/createLogger';


//Logger
const logger = createLogger('userservice');


const app = express();

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'users' });
});

const port = config.userPort;


app.listen(port, () => {
    logger.info(`User service running on port ${port}`);
  });