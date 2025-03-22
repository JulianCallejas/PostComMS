import swaggerJSDoc from "swagger-jsdoc";
import { config } from "../../config";


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
  apis: [
    './src/swagger/auth/swagger-auth-doc.sw',
    './src/swagger/users/swagger-users-doc.sw',
    './src/swagger/posts/swagger-posts-doc.sw',
  ],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);