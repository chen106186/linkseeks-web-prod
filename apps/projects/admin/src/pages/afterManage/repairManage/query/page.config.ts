import type { RouteConfig } from '@linkseeks/router-core'

const config: RouteConfig = {
  detail: {
    headerMeta: false,
    paddingMeta: false,
  },
  view: {
    authButtons: [{ name: '详情', key: 'detail' }],
    headerMeta: false,
    paddingMeta: false,
    cache: true,
  },
}

export default config
