import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '状态', key: 'status' },
      { name: '删除', key: 'delete' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
    ],
    cache: true,
  },
  add: {
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
    ],
  },
}

export default Config
