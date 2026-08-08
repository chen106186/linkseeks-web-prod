import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

// 供应会员列表列
export const supplierColumns = [
  {
    title: intl.formatMessage({ id: 'afterService.apply.supplier.columns.memberId', defaultMessage: '会员ID' }),
    dataIndex: 'memberId',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'afterService.apply.supplier.columns.name', defaultMessage: '会员名称' }),
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'afterService.apply.supplier.columns.memberTypeName', defaultMessage: '会员类型' }),
    dataIndex: 'memberTypeName',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'afterService.apply.supplier.columns.roleName', defaultMessage: '会员角色' }),
    dataIndex: 'roleName',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'afterService.apply.supplier.columns.levelTag', defaultMessage: '会员等级' }),
    dataIndex: 'levelTag',
    align: 'center',
  },
]

// 供应会员搜索列表列
export const supplierSeachColumns = [
  {
    title: intl.formatMessage({ id: 'eightD.xuhao', defaultMessage: '序号' }),
    dataIndex: 'memberId',
    align: 'center',
    width: 80,
  },
  {
    title: intl.formatMessage({ id: 'eightD.daibiaofang', defaultMessage: '代表方' }),
    dataIndex: 'behalf',
    align: 'center',
    width: 80,
  },
  {
    title: intl.formatMessage({ id: 'eightD.xingming', defaultMessage: '姓名' }),
    dataIndex: 'name',
    align: 'center',
    width: 250,
  },
  {
    title: intl.formatMessage({ id: 'eightD.bumen', defaultMessage: '部门' }),
    dataIndex: 'department',
    align: 'center',
    width: 100,
  },
  {
    title: intl.formatMessage({ id: 'eightD.zhiwei', defaultMessage: '职位' }),
    dataIndex: 'position',
    align: 'center',
    width: 150,
  },
  {
    title: intl.formatMessage({ id: 'eightD.dianhua', defaultMessage: '电话' }),
    dataIndex: 'phone',
    align: 'center',
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'eightD.youxiang', defaultMessage: '邮箱' }),
    dataIndex: 'email',
    align: 'center',
    width: 250,
  },
  {
    title: intl.formatMessage({ id: 'eightD.shuoming', defaultMessage: '说明' }),
    dataIndex: 'instructions',
    align: 'center',
    width: 100,
  },
  {
    title: intl.formatMessage({ id: 'eightD.zuchang', defaultMessage: '组长' }),
    dataIndex: 'groupLeader',
    align: 'center',
    width: 100,
  },
  {
    title: intl.formatMessage({ id: 'eightD.gongyingshangkejian', defaultMessage: '供应商可见' }),
    dataIndex: 'vendorVisibility',
    align: 'center',
    width: 100,
  },
  {
    title: intl.formatMessage({ id: 'eightD.caozuo', defaultMessage: '操作' }),
    dataIndex: 'operation',
    align: 'center',
    width: 100,
  },
]
// 用户列表
export const userListColumns = [
  {
    title: intl.formatMessage({ id: 'eightD.xingming', defaultMessage: '姓名' }),
    dataIndex: 'name',
    align: 'center',
    width: 250,
  },
  {
    title: intl.formatMessage({ id: 'eightD.bumen', defaultMessage: '部门' }),
    dataIndex: 'orgName',
    align: 'center',
    width: 100,
  },
  {
    title: intl.formatMessage({ id: 'eightD.zhiwei', defaultMessage: '职位' }),
    dataIndex: 'jobTitle',
    align: 'center',
    width: 150,
  },
  {
    title: intl.formatMessage({ id: 'eightD.dianhua', defaultMessage: '电话' }),
    dataIndex: 'phone',
    align: 'center',
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'eightD.youxiang', defaultMessage: '邮箱' }),
    dataIndex: 'email',
    align: 'center',
    width: 250,
  },
]
// 小组成员列表
export const teamColumns = [
  {
    title: intl.formatMessage({ id: 'eightD.xuhao', defaultMessage: '序号' }),
    dataIndex: 'index',
    key: 'index',
    width: 80,
    render: (value) => value + 1,
  },
  {
    title: intl.formatMessage({ id: 'eightD.daibiaofang', defaultMessage: '代表方' }),
    dataIndex: 'roleType',
    key: 'roleType',
    width: 150,
    render: (value) =>
      value == '1'
        ? intl.formatMessage({ id: 'eightD.gongyingshang', defaultMessage: '供应商' })
        : intl.formatMessage({ id: 'eightD.caigoushang', defaultMessage: '采购商' }),
  },
  {
    title: intl.formatMessage({ id: 'eightD.xingming', defaultMessage: '姓名' }),
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: intl.formatMessage({ id: 'eightD.bumen', defaultMessage: '部门' }),
    dataIndex: 'orgName',
    key: 'orgName',
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'eightD.zhiwei', defaultMessage: '职位' }),
    dataIndex: 'jobTitle',
    key: 'jobTitle',
    width: 120,
  },
  {
    title: intl.formatMessage({ id: 'eightD.dianhua', defaultMessage: '电话' }),
    dataIndex: 'phone',
    key: 'phone',
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'eightD.youxiang', defaultMessage: '邮箱' }),
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'eightD.shuoming', defaultMessage: '说明' }),
    dataIndex: 'legend',
    key: 'legend',
    width: 250,
    component: 'TextArea',
    editable: true,
    rules: [
      {
        max: 30,
      },
    ],
    editProps: {
      disabled: false,
    },
  },
  {
    title: intl.formatMessage({ id: 'eightD.zuchang', defaultMessage: '组长' }),
    dataIndex: 'isGroupLeader',
    key: 'isGroupLeader',
    width: 120,
    component: 'Switch',
    editable: true,
  },
  {
    title: intl.formatMessage({ id: 'eightD.gongyingshangkejian', defaultMessage: '供应商可见' }),
    dataIndex: 'isVisible',
    key: 'isVisible',
    width: 150,
    component: 'Switch',
    editable: true,
    editProps: {
      disabled: false,
    },
  },
  {
    title: intl.formatMessage({ id: 'eightD.caozuo', defaultMessage: '操作' }),
    dataIndex: 'operation',
    key: 'operation',
    width: 200,
    component: 'Button',
    editable: true,
    visible: true,
    editProps: {
      type: 'link',
      title: intl.formatMessage({ id: 'eightD.shanchu', defaultMessage: '删除' }),
      disabled: false,
    },
  },
]
