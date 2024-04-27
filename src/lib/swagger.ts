import type { Options } from 'swagger-jsdoc'
import { AUTH_SCHEMAS, CART_SCHEMAS, ORDER_SCHEMAS, PRODUCT_SCHEMAS, USER_SCHEMAS, UTIL_SCHEMAS } from 'schemas/swagger.js'
import packageDoc from '../../package.json' assert { type: 'json' }

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
      schemas: {
        ...AUTH_SCHEMAS,
        ...PRODUCT_SCHEMAS,
        ...CART_SCHEMAS,
        ...ORDER_SCHEMAS,
        ...USER_SCHEMAS,
        ...UTIL_SCHEMAS,
      },
    },
  },
  apis: ['./src/router/*.*'],
}
