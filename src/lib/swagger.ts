import type { Options } from 'swagger-jsdoc'
import swaggerJSDoc from 'swagger-jsdoc'
import { version } from '../../package.json'

const options: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Shop Api',
      description: 'Документация по API',
      version,
    },
    host: 'localhost:5000/api',
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

  apis: ['./src/router/*.ts', './src/schema/swagger.ts'],

}

export const swaggerSpec = swaggerJSDoc(options)
