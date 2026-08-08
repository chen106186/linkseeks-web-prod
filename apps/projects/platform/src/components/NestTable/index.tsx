import React, { useCallback, useEffect } from 'react'
import { Table } from 'antd'
import { TableProps, ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons'

export interface NestTableProps extends TableProps<any> {
  /**
   * 扁平化的递归嵌套类型, 后面一项永远为前一项的直系子集
   * column 可以是函数，此时可以根据业务返回不同的 column
   */
  NestColumns: (ColumnsType<any> | ((record?) => ColumnsType<any>))[],
  // 指定获得的子集数据类型
  childrenDataKey: string,
  childPagination?: false | TablePaginationConfig,
  childRowSelection?: any,
}

/**
 * 嵌套表格
 * @todo 实现无限嵌套， 目前暂时实现两层
 */
const NestTable: React.FC<NestTableProps> = (props) => {
  const { NestColumns, childrenDataKey, dataSource, pagination = false, childPagination = false, childRowSelection = null, ...resetProps } = props
  if (NestColumns.length > 2) {
    throw new Error('暂时不支持2项以上的嵌套table')
  }

  const [parentColumns = [], childColumns = []] = NestColumns

  const childRenderTable = useCallback((record) => {
    return <Table
      columns={typeof childColumns !== 'function' ? childColumns : childColumns(record)}
      size="middle"
      dataSource={record[childrenDataKey] || []}
      rowClassName={(_, index) => (index % 2) === 0 && "tb_bg"}
      rowKey='id'
      rowSelection={childRowSelection}
      pagination={childPagination}
    />
  }, [childColumns, childrenDataKey, childRowSelection])

  return (
    <Table
      columns={parentColumns as ColumnsType<any>}
      dataSource={dataSource}
      expandable={{
        expandedRowRender: childRenderTable,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <CaretDownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <CaretRightOutlined onClick={e => onExpand(record, e)} />
          )
      }}
      pagination={pagination}
      {...resetProps}
    />
  )
}

NestTable.defaultProps = {}

export default NestTable
