import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

// 用户列表
export const userColumns = [
  {
    title: intl.formatMessage({ id: 'afterService.apply.supplier.columns.name', defaultMessage: '姓名' }),
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
        ? `${intl.formatMessage({ id: 'eightD.gongyingshang', defaultMessage: '供应商' })}`
        : `${intl.formatMessage({ id: 'eightD.caigoushang', defaultMessage: '采购商' })}`,
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
    editProps: {},
  },
  {
    title: intl.formatMessage({ id: 'eightD.zuchang', defaultMessage: '组长' }),
    dataIndex: 'isGroupLeader',
    key: 'isGroupLeader',
    width: 120,
    component: 'Switch',
    editable: true,
    editProps: {},
  },
  {
    title: intl.formatMessage({ id: 'eightD.gongyingshangkejian', defaultMessage: '供应商可见' }),
    dataIndex: 'isVisible',
    key: 'isVisible',
    width: 150,
    component: 'Switch',
    editable: true,
    editProps: {},
  },
]
