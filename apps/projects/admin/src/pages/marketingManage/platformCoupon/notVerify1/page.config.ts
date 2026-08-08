import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '验证', key: 'verify' },
      { name: '批量审核通过', key: 'verifyBatch' },
    ],
    cache: true,
  },
}

export default Config
