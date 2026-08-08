import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '修改', key: 'edit' },
      { name: '详情', key: 'detail' },
      { name: '状态', key: 'status' },
    ],
    cache: true,
  },
}

export default Config
