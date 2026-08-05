import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: 'web装修', key: 'design/edit' },
      { name: '移动端装修', key: 'design/mobile/edit' },
      { name: 'web装修预览', key: 'design' },
      { name: '移动端装修预览', key: 'design/mobile' },
    ],
  },
}

export default Config
