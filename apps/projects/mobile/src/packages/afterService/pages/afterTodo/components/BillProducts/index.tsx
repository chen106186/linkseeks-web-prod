/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-24 15:15:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 11:35:36
 * @Description: 单据商品列表
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Input } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import ImageBox from '@/components/ImageBox'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export type BillProductsItemType = {
  /**
   * 采购单价
   */
  price: number
  /**
   * 商品图片
   */
  productPic: string
  /**
   * 与之关联的数量，如果退货发货单、那这个字段就表示是退货收货数量
   */
  relationCount: number
  /**
   * 订单编号
   */
  orderNo: string
  /**
   * 商品id
   */
  productId: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 商品分类
   */
  category: string
  /**
   * 商品品牌
   */
  brand: string
  /**
   * 商品单位
   */
  unit: string
  /**
   * 记录id
   */
  recordId: number
  /**
   * 单据数量
   */
  count: string
  /**
   * 对应单据申请数量
   */
  applyCount?: number
  /**
   * 对应单据数据id
   */
  billDetailId?: number
}

export type BillProductsValueType = Omit<BillProductsItemType, 'count'> & {
  /**
   * 单据数量
   */
  count: string
}

interface BillProductsProps {
  /**
   * 售后类型 1 退货 2 换货 3 维修
   */
  afterType: 1 | 2 | 3
  /**
   * 流程类型 1 发货 2 收货
   */
  flowType: 1 | 2
  /**
   * 值
   */
  value: BillProductsItemType[]
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * input改变触发事件
   */
  onChange?: (value: BillProductsValueType[]) => void
  /**
   * 是否可编辑
   */
  editable?: boolean
}

const BillProducts: React.FC<BillProductsProps> = (props: BillProductsProps) => {
  const { afterType, flowType, value, customStyle, onChange, editable } = props
  const intl = useIntl()
  // 标题map
  const AFTER_TYPE_NAME_MAP: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'afterTodo.components.reasonPopup.type.exchange', defaultMessage: '退货' }),
    2: intl.formatMessage({ id: 'afterTodo.components.reasonPopup.type.refund', defaultMessage: '换货' }),
    3: intl.formatMessage({ id: 'afterTodo.components.reasonPopup.type.repair', defaultMessage: '维修' }),
  }

  // 流程标题map
  const FLOW_TYPE_NAME_MAP: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'afterTodo.components.fahuo', defaultMessage: '发货' }),
    2: intl.formatMessage({ id: 'afterTodo.components.shouhuo', defaultMessage: '收货' }),
  }
  const handleInputChange = (text: string, recordId: number) => {
    const newData: BillProductsValueType[] = [...value] as any
    const index = newData.findIndex((item) => item.recordId === recordId)
    if (index !== -1) {
      newData.splice(index, 1, {
        ...newData[index],
        count: text,
      })
    }
    onChange?.(newData)
  }

  return (
    <View className={styles['bill-products']} style={customStyle}>
      {value.map((item, index) => (
        <View className={styles['bill-products-item']} key={index}>
          <MellowCard>
            <View className={styles['bill-products-item-product']}>
              <View className={styles['bill-products-item-product-left']}>
                <View className={styles['bill-products-item-product-picWrap']}>
                  <ImageBox
                    width="100%"
                    height="100%"
                    source={item.productPic}
                    borderRadius={4}
                    className={styles['bill-products-item-product-pic']}
                  />
                </View>
              </View>
              <View className={styles['bill-products-item-product-right']}>
                <Text className={styles['bill-products-item-product-name']}>{item.productName}</Text>
                <View className={styles['bill-products-item-product-description']}>
                  <View className={styles['bill-products-item-product-wrap']}>
                    <Text className={styles['bill-products-item-product-price']}>
                      {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                      {item.price}
                    </Text>
                    <Text className={styles['bill-products-item-product-desc']}>/{item.unit}</Text>
                  </View>
                  {editable ? (
                    <Text className={styles['bill-products-item-product-desc']}>
                      {intl.formatMessage({ id: 'afterTodo.components.yituihuoshouhuo', defaultMessage: '已退货收货' })}
                      :{` ${item.relationCount}`}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
            {editable ? (
              <View className={styles['bill-products-item-field']}>
                <Input
                  placeholder={`${intl.formatMessage({ id: 'afterTodo.components.shuru', defaultMessage: '输入' })}${
                    AFTER_TYPE_NAME_MAP[afterType]
                  }${FLOW_TYPE_NAME_MAP[flowType]}${intl.formatMessage({
                    id: 'afterTodo.components.shuliang',
                    defaultMessage: '数量',
                  })}`}
                  className={styles['bill-products-item-field-input']}
                  value={item.count}
                  onChange={(text: string) => handleInputChange(text, item.recordId)}
                />
              </View>
            ) : (
              <Cell
                border={false}
                customStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
                transposition
              >
                <Cell.Item
                  title={`${AFTER_TYPE_NAME_MAP[afterType]}${intl.formatMessage({
                    id: 'afterTodo.components.shuliang',
                    defaultMessage: '数量',
                  })}(${item.unit})`}
                  value={item.applyCount}
                  customHeadStyle={{
                    paddingTop: pxTransform(themeLayout['padding-s']),
                    paddingBottom: 0,
                  }}
                />
                <Cell.Item
                  title={`${FLOW_TYPE_NAME_MAP[flowType]}${intl.formatMessage({
                    id: 'afterTodo.components.fahuo',
                    defaultMessage: '发货',
                  })}/${intl.formatMessage({ id: 'afterTodo.components.shouhuo', defaultMessage: '收货' })}(${
                    item.unit
                  })`}
                  value={`${item.count}/${item.relationCount}`}
                  customHeadStyle={{
                    paddingTop: pxTransform(themeLayout['padding-s']),
                    paddingBottom: 0,
                  }}
                />
              </Cell>
            )}
          </MellowCard>
        </View>
      ))}
    </View>
  )
}

BillProducts.defaultProps = {
  editable: false,
}

export default BillProducts
