import { default as fsPromises } from 'node:fs/promises'
import express from 'express'
import { Headers, Request } from 'node-fetch'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { getCache, setCache, deleteCache, readCache, writeCache } from './fileCache.js'
import logger from './logger.js'
// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 6002
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction ? await fsPromises.readFile('./client/index.html', 'utf-8') : ''
const ssrManifest = isProduction ? await fsPromises.readFile('./client/.vite/ssr-manifest.json', 'utf-8') : undefined

// Create http server
const app = express()

function normalizeUrl(url) {
  const [path, query] = url.split('?')
  if (!query) return path

  const params = new URLSearchParams(query)
  const sortedParams = new URLSearchParams([...params.entries()].sort())

  return `${path}?${sortedParams.toString()}`
}

// 缓存中间件
async function cacheMiddleware(req, res, next) {
  const start = Date.now() // 记录请求开始时间

  res.on('finish', () => {
    // const duration = Date.now() - start // 计算请求耗时
    // console.log(`Request to ${req.url} took ${duration}ms`)
  })

  const key = normalizeUrl(req.url) // 使用标准化后的 URL 作为缓存键
  const cachedData = getCache(key)

  if (cachedData) {
    // console.log('Cache hit for:', key)
    return res.send(cachedData) // 如果缓存中有数据，直接返回
  } else {
    // console.log('Cache miss for:', key)
    const originalSend = res.send.bind(res)
    res.send = (body) => {
      setCache(key, body, 60) // 设置缓存，默认过期时间为 60 秒
      originalSend(body)
    }
    next()
  }
}

// app.use(cacheMiddleware)

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./client', { extensions: [] }))
}

const BACK_GATEWAY = !isProduction
  ? (await import('@apps/config')).getEnvDefine().OUT_BACK_GATEWAY
  : process.env.OUT_BACK_GATEWAY || 'http://lingxi-gateway-test-2023-v3.shushangyun.com:12880'
console.log('BACK_GATEWAY:', BACK_GATEWAY)
// 设置接口代理
app.use(
  '/api',
  createProxyMiddleware({
    target: BACK_GATEWAY, // 要代理的目标地址
    changeOrigin: true, // 设置为true，以便正确地改变请求头中的主机头
    pathRewrite: {
      '^/api': '',
    },
  }),
)

// 全局错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误:', err)
  res.status(500).send('服务器内部错误')
})

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fsPromises.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./server/entry-server.js')).render
    }

    const fetchRequest = createFetchRequest(req)

    const rendered = await render(fetchRequest, url, ssrManifest)
    const { helmet } = rendered

    const helmetData = helmet
      ? `
			${helmet.title.toString()}
			${helmet.meta.toString()}
			${helmet.link.toString()}
			${helmet.style.toString()}`
      : ''

    const html = template
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace(`<!--app-head-->`, helmetData ?? '')
      .replace(`<!--app-scripts-->`, helmet ? helmet.script.toString() : '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    logger.error(`路由处理错误: ${req.originalUrl}`, e)
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

// 添加未捕获异常处理
process.on('uncaughtException', (err) => {
  logger.error('未捕获的异常:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的 Promise 拒绝:', reason)
})

// server/request.js - react-router官方给的代码，用于将express请求转化成fetch
export default function createFetchRequest(req) {
  let origin = `${req.protocol}://${req.get('host')}`
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin)

  let controller = new AbortController()
  req.on('close', () => controller.abort())

  let headers = new Headers()

  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }

  const init = {
    method: req.method,
    headers,
    signal: controller.signal,
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }

  return new Request(url.href, init)
}
