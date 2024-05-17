import { HttpResponse, delay, http } from 'msw'

export const handlers = [
  http.get(
    '/api/users',

    async () => {
      await delay()
      return HttpResponse.json([
        { name: 'Harry' },
        { name: 'Ron' },
        { name: 'Hermione' },
      ])
    },
  ),
]
