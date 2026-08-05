import React, { useCallback } from 'react'
import { Table } from 'antd'
import { TableProps, ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons'

export interface NestTableProps extends TableProps<any> {
  /**
   * 扁平化的递归嵌套类型, 后面一项永远为前一项的直系子集
   */
  NestColumns: ColumnsType<any>[]
  childPagination?: false | TablePaginationConfig
  // 指定获得的子集数据类型
  childrenDataKey: string
}

/**
 * 嵌套表格
 * @todo 实现无限嵌套， 目前暂时实现两层
 */
const NestTable: React.FC<NestTableProps> = (props) => {
  const { NestColumns, childrenDataKey, pagination = false, childPagination = false, dataSource, ...resetProps } = props
  if (NestColumns.length > 2) {
    throw new Error('暂时不支持2项以上的嵌套table')
  }

  const [parentColumns = [], childColumns = []] = NestColumns

  const childRenderTable = useCallback(
    (record) => {
      return (
        <Table
          columns={childColumns}
          dataSource={record[childrenDataKey] || []}
          rowKey="id"
          pagination={childPagination}
        />
      )
    },
    [childColumns, childrenDataKey],
  )

  return (
    <Table
      columns={parentColumns}
      dataSource={dataSource}
      expandable={{
        expandedRowRender: childRenderTable,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
          ) : (
            <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
          ),
      }}
      pagination={false}
      {...resetProps}
    />
  )
}

NestTable.defaultProps = {}

export default NestTable
