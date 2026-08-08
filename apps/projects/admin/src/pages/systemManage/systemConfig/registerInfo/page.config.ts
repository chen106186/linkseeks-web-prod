import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '状态', key: 'status' },
      { name: '编辑', key: 'edit' },
      { name: '删除', key: 'delete' },
      { name: '新增', key: 'add' },
    ],
    cache: true,
  },
}

export default Config
