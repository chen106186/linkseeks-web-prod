import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: 'web装修', key: 'design/edit' },
      { name: '移动端装修', key: 'design/mobile/edit' },
      { name: 'web装修预览', key: 'design' },
      { name: '移动端装修预览', key: 'design/mobile' },
      { name: '启用', key: 'state' },
      { name: '编辑', key: 'edit' },
      { name: '停用', key: 'stop' },
      { name: '启用', key: 'enable' },
      { name: '设为默认商城', key: 'default' },
    ],
  },
}

export default Config
