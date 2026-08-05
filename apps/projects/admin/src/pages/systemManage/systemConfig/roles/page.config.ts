import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '关联会员资料', key: 'setMemberInfo' },
      { name: '详情', key: 'detail' },
      { name: '编辑', key: 'edit' },
      { name: '设置会员权限', key: 'setMemberAuth' },
      { name: '注册流程配置', key: 'setFlow' },
      { name: '状态', key: 'status' },
    ],
    cache: true,
  },
}

export default Config
