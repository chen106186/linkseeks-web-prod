import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '关闭店铺', key: 'close' },
      { name: '启用店铺', key: 'open' },
      { name: '装修', key: 'adorn' },
    ],
  },
}

export default Config
