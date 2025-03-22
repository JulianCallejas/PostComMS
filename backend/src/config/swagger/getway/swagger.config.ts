import swaggerJSDoc from "swagger-jsdoc";
import { config } from '../../index';

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PostComMS Documentación para la API REST',
      version: '1.0.0',
      description: 'Documentación para la API REST PostComMS',
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/config/swagger/auth/swagger-auth-doc.ts', './src/config/swagger/users/swagger-users-doc.ts', './src/config/swagger/posts/swagger-posts-doc.ts'],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);