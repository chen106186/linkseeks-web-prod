import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    authButtons: [{ name: '详情', key: 'detail' }],
    headerMeta: false,
    paddingMeta: false,
    cache: true,
  },
  detail: {
    paddingMeta: true,
  },
}

export default Config
