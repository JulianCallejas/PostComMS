import swaggerJSDoc from "swagger-jsdoc";
import { config } from '../../index';

// Swagger definition
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Documentación para la API REST PostComMS',
        version: '1.0.0',
        description: 'PostComMS Documentación para el microservicio de autenticación',
      },
      servers: [
        {
          url: `http://localhost:${config.authPort}`,
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
    apis: ['./src/config/swagger/auth/swagger-auth-doc.ts'],
  };
  
  export const swaggerDocs = swaggerJSDoc(swaggerOptions);