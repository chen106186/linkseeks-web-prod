/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 17:12:38
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-20 11:04:28
 * @Description: 适用商品
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { normalizeUnitPrice } from '../../utils'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
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
  const intl = useIntl()
  const { dataSource, ...rest } = props

  const columns: EditableColumns<ListItemDataType>[] = [
    {
      title: intl.formatMessage({ id: 'merchantCoupon.commodityId' }),
      dataIndex: 'commodityId',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.mainPic' }),
      dataIndex: 'mainPic',
      align: 'center',
      render: (text) => <img src={text} className={styles['product-img']} />,
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.name' }),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.customerCategoryName' }),
      dataIndex: 'customerCategoryName',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.brandName' }),
      dataIndex: 'brandName',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.unitName' }),
      dataIndex: 'unitName',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.unitPrice' }),
      dataIndex: 'unitPrice',
      render: (text) => {
        const unitPrice = normalizeUnitPrice(text)
        const start = unitPrice[0]?.price
        const end = unitPrice[unitPrice.length - 1]?.price
        return start !== end
          ? `${translate('web.common.currencySymbol')} ${start}~${end}`
          : `${translate('web.common.currencySymbol')} ${start}`
      },
    },
  ]

  return (
    <MellowCard title={intl.formatMessage({ id: 'merchantCoupon.suitCommodity' })} {...rest}>
      <PolymericTable dataSource={dataSource} columns={columns} pagination={null} />
    </MellowCard>
  )
}

export default ApplicableGoods
