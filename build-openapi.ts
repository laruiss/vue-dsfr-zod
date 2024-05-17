import fs from 'node:fs'
import yaml from 'yaml'
import {
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi'

import { registry } from './src/api/registry'

export function getOpenApiDocumentation() {
  return new OpenApiGeneratorV3(registry.definitions)
    .generateDocument({
      openapi: '3.0.0',
      info: {
        title: 'Dummy API',
        version: '1.0.0',
        description: 'A dummy API for testing purposes',
      },
      servers: [
        {
          url: '/api/v1',
        },
      ],
    })
}

function writeDocumentation() {
  // OpenAPI JSON
  const docs = getOpenApiDocumentation()

  const fileContent = yaml.stringify(docs)

  fs.writeFileSync(`${import.meta.dirname}/openapi-docs.yml`, fileContent, {
    encoding: 'utf-8',
  })
}

writeDocumentation()
