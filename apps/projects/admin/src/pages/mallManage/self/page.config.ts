import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '自营商城配置', key: 'configure' },
      { name: '分配自营商城', key: 'allocation' },
      { name: '编辑', key: 'edit' },
      { name: '开启关闭', key: 'enabled' },
    ],
    cache: true,
  },
}

export default Config
