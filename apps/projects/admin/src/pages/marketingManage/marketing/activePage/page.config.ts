import { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '移动端装修', key: 'fixtures/mobile' },
      { name: '装修', key: 'fixtures' },
      { name: '删除', key: 'delete' },
      { name: '状态', key: 'status' },
    ],
  },
}

export default Config
