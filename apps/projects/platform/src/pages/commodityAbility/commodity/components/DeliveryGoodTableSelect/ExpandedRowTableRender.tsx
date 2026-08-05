import { Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { PlannedDeliveryMaterialExpandableTableColumn } from '../../constants/page-table-column'

/**
 * 子table渲染
 * @param dataSource
 * @param row 下标index
 * @param selectedRowKeys 勾选的值 callback func
 */
interface ExpandedRowTableRenderProps {
  dataSource: any[]
  row?: number
  onChange?: (selectedRowKeys, index?: number) => void
  selectedRowKeys?: any[]
}

function ExpandedRowTableRender(props: ExpandedRowTableRenderProps) {
  const { row = 0, onChange, selectedRowKeys: selectedRowKeysProps = [] } = props

  const onSelectChange = (selectedRowKeys: any[]) => {
    let result = props.dataSource.filter((v) => selectedRowKeys.includes(v.orderNo))
    onChange(result, row)
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeysProps.map((v) => v.orderNo),
    onChange: onSelectChange,
  }

  return (
    <Table
      rowSelection={rowSelection}
      dataSource={props.dataSource}
      rowKey={(record) => record.orderNo}
      columns={PlannedDeliveryMaterialExpandableTableColumn}
      pagination={false}
    />
  )
}

export default ExpandedRowTableRender
