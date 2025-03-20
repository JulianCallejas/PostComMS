import dotenv from 'dotenv';

dotenv.config();


export const config = {
  port: Number(process.env.PORT) || 3000,
  authPort: Number(process.env.AUTHPORT) || 3001,
  userPort: Number(process.env.USERPORT) || 3002,
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  services: {
    auth: process.env.AUTH_SERVICE_URL!,
    user: process.env.USER_SERVICE_URL!,
    
  }
};