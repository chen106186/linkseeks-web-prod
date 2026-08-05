import { graphql, rest } from 'msw'

// Mock Data
export const posts = {
  code: 1000,
  data: {
    userId: 2,
    username: 'Bob',
  },
}

// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
  rest.get('/api/list', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts))
  }),

  rest.post('/api/login', async (req, res, ctx) => {
    const data: any = await req.json()

    return res(ctx.status(200), ctx.json({ code: 1000, data: { username: data.username } }))
  }),
]
