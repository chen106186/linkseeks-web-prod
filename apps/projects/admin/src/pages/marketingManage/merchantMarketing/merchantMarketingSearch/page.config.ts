import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [{ name: '详情', key: 'detail' }],
    cache: true,
  },
}

export default Config
