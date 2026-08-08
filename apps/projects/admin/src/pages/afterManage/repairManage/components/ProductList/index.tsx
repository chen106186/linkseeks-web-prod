/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 11:38:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-05 14:58:55
 * @Description: 商品列表
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'

interface HistoryListHistoryListProps {
  dataSource: {
    [key: string]: any
  }[]
  // 标题
  title?: string
  // 表格列
  columns: EditableColumns[]
  // rowKey
  rowKey?: string
  // 目标路径
  target?: string
  // loading
  loading?: boolean
}

const ProductList: React.FC<HistoryListHistoryListProps> = ({
  dataSource = [],
  title = '标题',
  columns = [],
  rowKey = 'id',
  target,
  loading = false,
}) => {
  return (
    <MellowCard title={title}>
      <PolymericTable rowKey={rowKey} dataSource={dataSource} columns={columns} loading={loading} pagination={null} />
    </MellowCard>
  )
}

export default ProductList
