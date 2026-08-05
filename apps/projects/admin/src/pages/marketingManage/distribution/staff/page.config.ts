import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '修改状态', key: 'status' },
      { name: '新增', key: 'add' },
      { name: '修改', key: 'edit' },
      { name: '下线', key: 'downline' },
    ],
    cache: true,
  },
}

export default Config
