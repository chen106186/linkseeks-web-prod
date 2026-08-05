import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    title: '团购发货管理',
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '新增', key: 'create' },
      { name: '导出', key: 'export' },
      { name: '配送', key: 'confirm' },
    ],
    cache: true,
  },
}

export default Config
