import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    menuMeta: false,
    authButtons: [{ name: '冻结', key: 'freeze' }],
    headerMeta: false,
    paddingMeta: false,
  },
}

export default Config
