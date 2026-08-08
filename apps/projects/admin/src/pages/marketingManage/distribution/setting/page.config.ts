import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [{ name: '编辑', key: 'edit' }],
    cache: true,
  },
}

export default Config
