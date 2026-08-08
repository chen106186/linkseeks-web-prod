import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    menuMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '启用', key: 'state' },
      { name: '编辑', key: 'edit' },
      { name: '预览', key: 'preview' },
      { name: '停用', key: 'stop' },
      { name: '启用', key: 'enable' },
      { name: '设为默认商城', key: 'default' },
    ],
  },
}

export default Config
