/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 17:12:38
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-24 14:03:18
 * @Description: 适用商品
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { normalizeUnitPrice } from '../../utils'
import styles from './index.less'

export type ListItemDataType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 商品id
   */
  commodityId: number
  /**
   * 商品图片
   */
  mainPic: string
  /**
   * 商品品类
   */
  customerCategoryName: string
  /**
   * 商品品牌
   */
  brandName: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品单位
   */
  unitName: string
  /**
   * 阶梯价格
   */
  unitPrice: {
    [key: string]: any
  }
}

interface IProps {
  /**
   * 数据
   */
  dataSource: ListItemDataType[]
}

const ApplicableGoods: React.FC<IProps> = (props) => {
  const { dataSource, ...rest } = props

  const columns: EditableColumns<ListItemDataType>[] = [
    {
      title: '商品ID',
      dataIndex: 'commodityId',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'mainPic',
      align: 'center',
      render: (text) => <img src={text} className={styles['product-img']} />,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'customerCategoryName',
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
    },
    {
      title: '单位',
      dataIndex: 'unitName',
    },
    {
      title: '商品价格',
      dataIndex: 'unitPrice',
      render: (text) => {
        const unitPrice = normalizeUnitPrice(text)
        const start = unitPrice[0]?.price
        const end = unitPrice[unitPrice.length - 1]?.price
        return start !== end ? `¥ ${start}~${end}` : `¥ ${start}`
      },
    },
  ]

  return (
    <MellowCard title="适用商品" {...rest}>
      <PolymericTable dataSource={dataSource} columns={columns} pagination={null} />
    </MellowCard>
  )
}

export default ApplicableGoods
