import type { Options } from 'swagger-jsdoc'
import packageDoc from '../../package.json' assert { type: 'json' }

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Shop Api',
      description: 'Документация по API',
      version: packageDoc.version,
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
  },

  apis: ['./src/router/*.*', '/src/schema/*.*', '/dist/src/schema/*.*'],
}
