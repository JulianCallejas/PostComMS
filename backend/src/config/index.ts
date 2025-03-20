import dotenv from 'dotenv';

dotenv.config();


export const config = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  services: {
    
  }
};