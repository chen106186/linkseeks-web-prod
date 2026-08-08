import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '审核', key: 'examine' },
      { name: '详情', key: 'detail' },
      { name: '活动执行数据', key: 'execution' },
    ],
    cache: true,
  },
}

export default Config
