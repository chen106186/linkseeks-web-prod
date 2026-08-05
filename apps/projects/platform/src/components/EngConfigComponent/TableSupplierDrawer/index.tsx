/**
 * 选择供应商弹窗
 */
import { ColumnType } from 'antd/lib/table'
import React, { memo, forwardRef } from 'react'
import CommonTableDrawer from '../CommonTableDrawer'
import { schema } from './schema'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

interface PropsType {
  handleOk?: (data: any) => void
  onQueryAll?: (value?: any) => void
  otherParams?: Object
}

const intl = getIntl()

const tableColumns: ColumnType<any>[] = [
  { title: intl.formatMessage({ id: 'material.supplier.id', defaultMessage: '供应商ID' }), dataIndex: 'id', key: 'id' },
  {
    title: intl.formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
    dataIndex: 'name',
    key: 'name',
  },
]

const TableSupplierDrawer = ({ handleOk, onQueryAll, otherParams = {}, ...rest }: PropsType, ref) => {
  return (
    <CommonTableDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'material.select.supplier.modal.title', defaultMessage: '选择供应商' })}
      queryAllLabel={intl.formatMessage({ id: 'material.supplier.all', defaultMessage: '全部供应商' })}
      onOk={handleOk}
      onQueryAll={onQueryAll}
      tableColumns={tableColumns}
      fetchTableApi={postMemberManageLowerProviderPage}
      controlSchema={schema}
      {...rest}
    />
  )
}

export default memo(forwardRef(TableSupplierDrawer))
