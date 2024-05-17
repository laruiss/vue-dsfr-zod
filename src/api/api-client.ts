import { createApiClient } from './openapi-client'

export const apiClient = createApiClient(import.meta.env.BASE_API ?? '/')
