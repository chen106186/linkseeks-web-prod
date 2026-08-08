import type { RouteConfig } from '@linkseeks/router-core'

const Config: RouteConfig = {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '提交', key: 'submit' },
      { name: '批量提交审核', key: 'submitBatch' },
      { name: '删除', key: 'delete' },
      { name: '批量删除', key: 'deleteBatch' },
    ],
    cache: true,
  },
}

export default Config
