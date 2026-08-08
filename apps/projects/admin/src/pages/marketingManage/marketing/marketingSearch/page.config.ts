import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '修改时间', key: 'update' },
      { name: '取消', key: 'cancel' },
      { name: '终止', key: 'stop' },
      { name: '重新启动', key: 'restart' },
    ],
    cache: true,
  },
}

export default Config
