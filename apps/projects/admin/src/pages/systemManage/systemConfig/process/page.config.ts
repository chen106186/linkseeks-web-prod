import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '删除', key: 'delete' },
    ],
    cache: true,
  },
}

export default Config
