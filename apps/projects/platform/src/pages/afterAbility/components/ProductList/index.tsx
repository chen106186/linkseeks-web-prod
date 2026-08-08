/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 11:38:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-05 14:58:55
 * @Description: 商品列表
 */
import React from 'react'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'

interface HistoryListHistoryListProps extends MellowCardProps {
  /**
   * 数据
   */
  dataSource: {
    [key: string]: any
  }[]
  /**
   * 标题
   */
  title?: string
  /**
   * 表格列
   */
  columns: EditableColumns[]
  /**
   * 行 key
   */
  rowKey?: string
  /**
   * 订单详情前缀
   */
  target?: string
  /**
   * Table loading
   */
  loading?: boolean
}

const ProductList: React.FC<HistoryListHistoryListProps> = ({
  dataSource = [],
  title = '',
  columns = [],
  rowKey = 'id',
  target,
  loading = false,
  ...rest
}) => {
  return (
    <MellowCard title={title} {...rest}>
      <PolymericTable rowKey={rowKey} dataSource={dataSource} columns={columns} loading={loading} pagination={null} />
    </MellowCard>
  )
}

export default ProductList
