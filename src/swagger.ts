import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "API cho đồ án Xây Dựng Quản Lý Thư Viện",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://127.0.0.1:3000",
      },
    ],
  },
  apis: ["src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
