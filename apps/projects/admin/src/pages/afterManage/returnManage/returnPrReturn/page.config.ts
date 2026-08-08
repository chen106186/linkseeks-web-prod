import type { RouteConfig } from '@linkseeks/router-core'

const config: RouteConfig = {
  view: {
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '编辑', key: 'edit' },
    ],
    headerMeta: false,
    paddingMeta: false,
    cache: true,
  },
}

export default config
