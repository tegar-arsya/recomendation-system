import swaggerJSDoc from "swagger-jsdoc";
import swagerUi from 'swagger-ui-express';

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Recomendation System',
        version: '1.0.0',
        description: 'Documentation for application recomendation system',
      },
    },
    apis: ['./routes/*.js'], // Path to your API routes
};

const specs = swaggerJSDoc(options);

export {
    specs,
    swagerUi
}