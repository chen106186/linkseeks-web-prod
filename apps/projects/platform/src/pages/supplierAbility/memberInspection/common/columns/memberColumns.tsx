import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'

const intl = getIntl()

export const memberColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({
      id: 'supplier.management.import.query.supplierId',
      defaultMessage: '供应商 ID',
    })}`,
    dataIndex: 'memberId',
  },
  {
    title: `${intl.formatMessage({
      id: 'supplier.supplierInspection.common.columns.index.supplierName',
      defaultMessage: '供应商名称',
    })}`,
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({
      id: 'supplier.supplierInspection.common.columns.index.supplierLifecycle',
      defaultMessage: '生命周期阶段',
    })}`,
    dataIndex: 'lifeCycleStageName',
  },
  {
    title: `${intl.formatMessage({
      id: 'supplier.supplierInspection.common.columns.index.supplierEntryTime',
      defaultMessage: '入库时间',
    })}`,
    dataIndex: 'registerTime',
  },
  // {
  //   title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberType'})}`,
  //   dataIndex: 'memberTypeName',
  // },
  // {
  //   title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberRole'})}`,
  //   dataIndex: 'roleName',
  // },
  // {
  //   title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberGrade'})}`,
  //   dataIndex: 'levelTag',
  // },
]
