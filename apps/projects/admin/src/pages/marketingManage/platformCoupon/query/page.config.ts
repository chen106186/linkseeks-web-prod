import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '取消', key: 'cancel' },
      { name: '重启', key: 'restart' },
      { name: '修改', key: 'edit' },
      { name: '终止', key: 'stop' },
    ],
    cache: true,
  },
}

export default Config
