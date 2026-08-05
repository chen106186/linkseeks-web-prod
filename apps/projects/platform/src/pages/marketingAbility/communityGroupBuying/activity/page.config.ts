import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '团订单', key: 'order' },
      { name: '结束活动', key: 'stop' },
    ],
    cache: true,
  },
}

export default Config
