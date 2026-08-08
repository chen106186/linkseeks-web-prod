import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '修改状态', key: 'status' },
      { name: '审核', key: 'examine' },
      { name: '详情', key: 'detail' },
    ],
    cache: true,
  },
}

export default Config
