import { ColumnsType } from 'antd/es/table'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const enterprisesColumn: ColumnsType<any> = [
  {
    title: intl.formatMessage({ id: 'handling.huiyuanID' }),
    dataIndex: 'memberId',
  },
  {
    title: intl.formatMessage({ id: 'handling.huiyuanmingcheng' }),
    dataIndex: 'name',
  },
  {
    title: intl.formatMessage({ id: 'handling.huiyuanleixing' }),
    dataIndex: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'handling.huiyuanjuese' }),
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'handling.huiyuandengji' }),
    dataIndex: 'levelTag',
  },
]
