import type { Options } from 'swagger-jsdoc'
import packageDoc from '../../package.json' assert { type: 'json' }

export function swaggerOptions({ ...schemas }: any) {
  return <Options>{
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
          ...schemas,
        },
      },
    },
    apis: ['./src/router/*.*'],
  }
}
