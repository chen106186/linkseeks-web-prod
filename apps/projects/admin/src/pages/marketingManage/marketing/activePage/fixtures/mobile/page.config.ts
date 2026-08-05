import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    menuMeta: false,
    authButtons: [{ name: '详情', key: 'detail' }],
  },
}

export default Config
