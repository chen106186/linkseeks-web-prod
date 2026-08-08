/**
 * 选择客户弹窗
 */
import { ColumnType } from 'antd/lib/table'
import React, { memo, forwardRef } from 'react'
import CommonTableDrawer from '../CommonTableDrawer'
import { schema } from './schema'
import { getMemberManageProcessBuyerMember } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

interface PropsType {
  handleOk?: (data: any) => void
  onQueryAll?: (value?: any) => void
  otherParams?: Object
}

const intl = getIntl()

const tableColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'processRuleSetting.customerID', defaultMessage: '客户ID' }),
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: intl.formatMessage({ id: 'processRuleSetting.customerName', defaultMessage: '客户名称' }),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'contract.type', defaultMessage: '会员类型' }),
    dataIndex: 'memberTypeName',
    key: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'contract.role', defaultMessage: '会员角色' }),
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'contract.level', defaultMessage: '会员等级' }),
    dataIndex: 'levelTag',
    key: 'levelTag',
  },
]

const TableMaterialDrawer = ({ handleOk, onQueryAll, otherParams = {}, ...rest }: PropsType, ref) => {
  return (
    <CommonTableDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'processRuleSetting.selectCustomer', defaultMessage: '选择客户' })}
      queryAllLabel={intl.formatMessage({ id: 'processRuleSetting.allCustomer', defaultMessage: '全部客户' })}
      onOk={handleOk}
      onQueryAll={onQueryAll}
      tableColumns={tableColumns}
      fetchTableApi={getMemberManageProcessBuyerMember}
      controlSchema={schema}
      {...rest}
    />
  )
}

export default memo(forwardRef(TableMaterialDrawer))
