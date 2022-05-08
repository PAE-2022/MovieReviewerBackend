import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Reviewer',
      version: '0.1.0',
    },
  },
  apis: ['src/routes/**/*.ts', 'src/dto/**/*.ts', 'src/models/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
