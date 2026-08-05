import { graphql, rest } from 'msw'
import { mobileSuccessGet, mobileErrorGet } from './data'

// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
  rest.get('/api/member/mobile/security/get', async (req, res, ctx) => {
    const { searchParams } = req.url
    const test = searchParams.get('test')
    return res(ctx.status(200), ctx.json(test == '1' ? mobileSuccessGet : mobileErrorGet))
  }),

  rest.post('/api/member/mobile/security/phone/update', async (req, res, ctx) => {
    const { data }: any = await req.json()

    return res(ctx.status(200), ctx.json({ code: 1000, data: { username: data } }))
  }),
]
