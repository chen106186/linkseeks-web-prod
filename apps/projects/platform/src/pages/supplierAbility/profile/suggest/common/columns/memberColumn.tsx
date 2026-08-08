import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'

const intl = getIntl()

export const memberColumns: ColumnsType<any> = [
  // {
  //   title: `${intl.formatMessage({ id: 'supplier.management.import.query.supplierId' })}`,
  //   dataIndex: 'memberId',
  // },
  {
    title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
    dataIndex: 'upperName',
  },
  // {
  //   title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberType'})}`,
  //   dataIndex: 'memberTypeName',
  // },
  // {
  //   title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberRole'})}`,
  //   dataIndex: 'roleName',
  // },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberGrade' })}`,
    dataIndex: 'levelTag',
  },
]
