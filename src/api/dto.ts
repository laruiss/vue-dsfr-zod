import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const defaultErrorDto = z.object({
  error: z.object({
    code: z.number().openapi({ description: 'Error code' }),
    message: z.string().openapi({ description: 'Explicit error message' }),
  }).openapi({ description: 'Default error object' }),
}).openapi({ description: 'Default error response' })

export const userIdSchema = z.string().openapi({
  param: {
    name: 'id',
    in: 'path',
  },
  example: '1212121',
})

export const userOutputDto = z.object({
  id: z.number().openapi({ description: 'User ID', example: 4341 }),
  name: z.string().openapi({ description: 'User fullname', example: 'John Doe' }),
  age: z.number().positive().min(18, 'Vous devez être majeur').openapi({ description: 'User age', example: 42, exclusiveMinimum: false }),
  email: z.string().email().openapi({ description: 'User email', example: 'j.doe@example.com' }),
}).openapi({ description: 'A user in the DB' })

export const usersOutputDto = z.array(userOutputDto).openapi({ description: 'List of users' })

export const userCreateDto = userOutputDto.omit({ id: true }).openapi({ description: 'User input' })
export const userUpdateDto = userOutputDto.partial({ id: true }).openapi({ description: 'User update DTO' })
