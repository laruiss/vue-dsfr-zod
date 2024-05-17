import {
  OpenAPIRegistry,
  type RouteConfig,
} from '@asteasolutions/zod-to-openapi'
import type { makeApi } from '@zodios/core'

import {
  defaultErrorDto,
  userCreateDto,
  userIdSchema,
  userOutputDto,
  userUpdateDto,
  usersOutputDto,
} from './dto'

export const registry = new OpenAPIRegistry()

// Register definitions here
registry.registerParameter('UserId', userIdSchema)
registry.register('DefaultError', defaultErrorDto)
registry.register('User', userOutputDto)
registry.register('Users', usersOutputDto)
registry.register('UserCreateDto', userCreateDto)
registry.register('UserUpdateDto', userUpdateDto)

const routeConfigs: (RouteConfig & { alias: string })[] = [
  {
    method: 'get',
    path: '/users',
    alias: 'getUsers',
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: usersOutputDto,
          },
        },
      },
      204: {
        description: 'No users in the DB yet',
        content: undefined,
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: defaultErrorDto,
          },
        },
      },
    },
  },
  {
    method: 'get',
    path: '/users/{id}',
    alias: 'getUser',
    responses: {
      200: {
        description: 'User details',
        content: {
          'application/json': {
            schema: userOutputDto,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: defaultErrorDto,
          },
        },
      },
    },
  },
  {
    method: 'post',
    path: '/users',
    alias: 'createUser',
    request: {
      body: {
        content: {
          'application/json': {
            schema: userCreateDto,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User created',
        content: {
          'application/json': {
            schema: userOutputDto,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: defaultErrorDto,
          },
        },
      },
    },
  },
] as const

for (const routeConfig of routeConfigs) {
  registry.registerPath(routeConfig)
}

export const apiRouteConfigs: Parameters<typeof makeApi>[0] = routeConfigs.map((routeConfig) => {
  const { alias, responses, method, path } = routeConfig
  const responseDetails = responses[200] ?? responses?.[201] ?? responses?.[204]
  const response = responseDetails.content?.['application/json']?.schema
  const errors = Object.entries(responses).map(([
    status,
    errorDetails,
  ]) => ({
    status,
    description: errorDetails.description,
    schema: errorDetails.content?.['application/json']?.schema,
  }))
  return {
    method,
    path,
    alias,
    response,
    errors,
  }
})

// registry.registerPath({
//   method: 'get',
//   path: '/users',
//   responses: {
//     200: {
//       description: 'List of users',
//       content: {
//         'application/json': {
//           schema: usersOutputDto,
//         },
//       },
//     },
//     204: {
//       description: 'No users in the DB yet',
//     },
//     401: {
//       description: 'Unauthorized',
//       content: {
//         'application/json': {
//           schema: defaultErrorDto,
//         },
//       },
//     },
//   },
// })

// registry.registerPath({
//   method: 'get',
//   path: '/users/{id}',
//   responses: {
//     200: {
//       description: 'User details',
//       content: {
//         'application/json': {
//           schema: userOutputDto,
//         },
//       },
//     },
//     401: {
//       description: 'Unauthorized',
//       content: {
//         'application/json': {
//           schema: defaultErrorDto,
//         },
//       },
//     },
//   },
// })

// registry.registerPath({
//   method: 'post',
//   path: '/users',
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: userCreateDto,
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: 'User created',
//       content: {
//         'application/json': {
//           schema: userOutputDto,
//         },
//       },
//     },
//     401: {
//       description: 'Unauthorized',
//       content: {
//         'application/json': {
//           schema: defaultErrorDto,
//         },
//       },
//     },
//   },
// })
