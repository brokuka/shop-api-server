import type { Options } from 'swagger-jsdoc'
import packageDoc from '../../package.json' assert { type: 'json' }

export const swaggerCssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css'

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.3',
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

  apis: ['./src/router/*.*', './src/schema/*.*'],
}
