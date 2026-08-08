/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-29 13:46:37
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-19 14:06:22
 * @Description: 售后商品
 */
import React, { CSSProperties } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { checkIsPointsOrder } from '@/constants/const/order'
import MellowCard from '@/components/MellowCard'
import ImageBox from '@/components/ImageBox'
import { PayListItem } from '../../../afterRecords/refundRecords/components/PayList'
import styles from './index.module.scss'

// 基础数据
export type AsProductsItemType = {
  /**
   * 订单id
   */
  orderId?: number
  /**
   * 订单记录id
   */
  orderRecordId?: number
  /**
   * 订单编号
   */
  orderNo?: string
  /**
   * 商品id
   */
  productId?: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category?: string
  /**
   * 单位
   */
  brand?: string
  /**
   * 单位
   */
  unit: string
  /**
   * 采购数量
   */
  purchaseCount?: number
  /**
   * 商品主图
   */
  skuPic: string
  /**
   * 采购单价
   */
  purchasePrice?: number
  /**
   * 支付信息
   */
  payList?: PayListItem[]
  /**
   * 商品工作流key
   */
  processKey?: string
  /**
   * 是否含税
   */
  isHasTax?: number
  /**
   * 税率
   */
  taxRate?: number
  /**
   * 合同id
   */
  contractId?: number
  /**
   * 合同编号
   */
  contractNo?: string
  /**
   * 关联商品名称
   */
  associated?: string
  /**
   * 关联商品id
   */
  associatedProductId?: string
  /**
   * 关联商品名称、规格
   */
  associatedProductName?: string
  /**
   * 关联商品规格
   */
  associatedType?: string
  /**
   * 关联商品品类
   */
  associatedCategory?: string
  /**
   * 关联商品品牌
   */
  associatedBrand?: string
  /**
   * 关联商品单位
   */
  associatedUnit?: string
  /**
   * 商品skuId
   */
  skuId: number
  /**
   * 剩余可申请数量
   */
  remaining: number
}

export interface AsProductsItemProps {
  /**
   * 数据
   */
  data: AsProductsItemType
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /**
   * 自定义外部className
   */
  customClassName?: string
  /**
   * 大小，可选 'large' 'default'
   */
  size?: 'large' | 'default'
  /**
   * 自定义渲染 description
   */
  customRenderDescription?: (data: AsProductsItemType) => React.ReactNode
  /**
   * 自定义渲染 数量
   */
  customRenderQuantity?: (data: AsProductsItemType) => React.ReactNode
  /**
   * 订单类型
   */
  orderType: number
}

export const AsProductsItem: React.FC<AsProductsItemProps> = (props: AsProductsItemProps) => {
  const { data, customStyle, customClassName, size, customRenderDescription, customRenderQuantity, orderType } = props

  const intl = useIntl()

  const imgSize: { [key: string]: number } = {
    large: 80,
    default: 48,
  }

  const isPointsOrder = checkIsPointsOrder(orderType)

  return (
    <View className={classNames(styles['as-products-item'], customClassName)} style={customStyle}>
      <View className={styles['as-products-item-left']}>
        <ImageBox
          width={pxTransform(imgSize[size as string])}
          height={pxTransform(imgSize[size as string])}
          source={data.skuPic as string}
          borderRadius={4}
        />
      </View>
      <View className={styles['as-products-item-right']}>
        <Text className={styles['as-products-item-name']}>{data.productName}</Text>
        {(size === 'large' && data.category) || customRenderDescription ? (
          <>
            {!customRenderDescription ? (
              <Text className={styles['as-products-item-category']}>{data.category}</Text>
            ) : (
              customRenderDescription(data)
            )}
          </>
        ) : null}
        <View className={styles['as-products-item-description']}>
          {data.purchasePrice !== undefined ? (
            <View className={styles['as-products-item-wrap']}>
              <Text className={styles['as-products-item-price']}>
                {!isPointsOrder ? intl.formatMessage({ id: 'currency', defaultMessage: '￥' }) : ''}
                {data.purchasePrice}
                {isPointsOrder ? intl.formatMessage({ id: 'currency.points', defaultMessage: '积分' }) : ''}
              </Text>
              <Text className={styles['as-products-item-desc']}>/{data.unit}</Text>
            </View>
          ) : null}
          {!customRenderQuantity ? (
            <>
              {data.purchaseCount ? (
                <Text className={styles['as-products-item-desc']}>x{data.purchaseCount}</Text>
              ) : null}
            </>
          ) : (
            customRenderQuantity(data)
          )}
        </View>
      </View>
    </View>
  )
}

AsProductsItem.defaultProps = {
  customStyle: {},
  size: 'default',
}

interface IProps {
  /**
   * 标题
   */
  title: string
  /**
   * 数据
   */
  dataSource: AsProductsItemType[]
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /**
   * 大小，可选 'large' 'default'
   */
  size?: AsProductsItemProps['size']
}

const AsProducts: React.FC<IProps> = (props: IProps) => {
  const { title, dataSource, customStyle, size } = props

  return (
    <MellowCard
      title={title}
      style={customStyle}
      bodyStyle={{
        padding: 0,
      }}
      headStyle={{
        borderBottomWidth: 0,
      }}
    >
      <View className={styles['as-products']}>
        {dataSource.map((item) => (
          <AsProductsItem
            key={item.orderRecordId}
            data={item}
            customClassName={styles['as-products-item__notLast']}
            size={size}
          />
        ))}
      </View>
    </MellowCard>
  )
}

AsProducts.defaultProps = {
  customStyle: {},
  size: 'default',
}

export default AsProducts
