/**
 * @Description: 售后申请商品组件
 */
import React from 'react'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'

interface AsProductListProps {
  /**
   * 数据
   */
  dataSource: {
    [key: string]: any
  }[]
  /**
   * 标题
   */
  title: string
  /**
   * 表格列
   */
  columns: EditableColumns[]
  /**
   * 行 key
   */
  rowKey?: string
  /**
   * Table loading
   */
  loading?: boolean
}

const AsProductList: React.FC<AsProductListProps> = ({
  dataSource = [],
  title = '',
  columns = [],
  rowKey = 'id',
  loading = false,
}) => {
  return (
    <MellowCard title={title}>
      <PolymericTable rowKey={rowKey} dataSource={dataSource} columns={columns} loading={loading} pagination={null} />
    </MellowCard>
  )
}

export default AsProductList
