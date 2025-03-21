import swaggerJSDoc from "swagger-jsdoc";
import { config } from "../../config";

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación para la API REST PostComMS',
      version: '1.0.0',
      description: 'PostComMS Documentación para el microservicio de posts',
    },
    servers: [
      {
        url: `http://localhost:${config.postPort}`,
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
  apis: ['./src/config/swagger/posts/swagger-posts-doc.sw'],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);