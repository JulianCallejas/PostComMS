import winston from 'winston';

export const createLogger = (serviceName: string): winston.Logger => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `logs/${serviceName}.log` })
    ]
  });

  return logger;
};