import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Stepper from '@/components/Stepper'
import Cell from '@/components/Cell'
import { isMaterialOrder } from '../../../../utils'
import AsProductsList, { AsProductsItemProps } from '../AsProductsList'
import styles from './index.module.scss'

export interface AsDataItem {
  /**
   * 订单id
   */
  orderId: number
  /**
   * 订单记录id
   */
  orderRecordId: number
  /**
   * 订单号
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
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand?: string
  /**
   * 单位
   */
  unit: string
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 申请数量
   */
  asCount: number | string
  /**
   * 申请金额
   */
  asAmount?: number
  /**
   * 支付信息 ,ReturnGoodsPayVO
   */
  payList?: any[]
  /**
   * 是否需要退货
   */
  isNeedReturn?: number
  /**
   * 是否选中的
   */
  checked?: boolean
  /**
   * 商品主图
   */
  skuPic: string
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

interface IProps {
  /**
   * 标题
   */
  title: string
  /**
   * 数据
   */
  dataSource: AsDataItem[]
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 提交事件
   */
  onSubmit?: (values: AsDataItem[]) => void
  /**
   * 大小，可选 'large' 'default'
   */
  size?: AsProductsItemProps['size']
  /**
   * 售后类型 1 退货 2 换货 3 维修
   */
  afterType: 1 | 2 | 3
  /**
   * 订单类型
   */
  orderType: number
}

const AsProductsPro: React.FC<IProps> = (props: IProps) => {
  const { title, dataSource, customStyle, onSubmit, size, afterType, orderType } = props

  const intl = useIntl()

  // 标题map
  const TITLE_MAP: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'afterTodo.components.asProductsPro.type.refund', defaultMessage: '退货' }),
    2: intl.formatMessage({ id: 'afterTodo.components.asProductsPro.type.exchange', defaultMessage: '换货' }),
    3: intl.formatMessage({ id: 'afterTodo.components.asProductsPro.type.repair', defaultMessage: '维修' }),
  }

  const handleStepperChange = (value: number, recordId: number) => {
    const newData = [...dataSource]
    const index = dataSource.findIndex((item) => item.orderRecordId === recordId)
    if (index !== -1) {
      const current = newData[index]
      const newPayList = current.payList?.map((item) => ({
        ...item,
        refundAmount: item.payTime
          ? +(value * (current.purchasePrice as number) * (item.payRatio! / 100)).toFixed(2)
          : 0,
      }))
      newData.splice(index, 1, {
        ...newData[index],
        asCount: value,
        payList: newPayList,
        asAmount: isMaterialOrder(orderType)
          ? value * current.purchasePrice
          : newPayList && newPayList.length
          ? newPayList.reduce((pre, now) => now.refundAmount + pre, 0)
          : 0,
      })
    }
    onSubmit?.(newData)
  }

  return (
    <MellowCard
      title={title}
      style={customStyle}
      headStyle={{
        borderBottomWidth: pxTransform(0),
      }}
      bodyStyle={{
        paddingTop: pxTransform(0),
        paddingBottom: pxTransform(0),
      }}
    >
      {dataSource.length > 1 ? (
        <View className={styles['asProductsPro-list-mult']}>
          <AsProductsList
            dataSource={dataSource.map((item) => ({ ...item, purchaseCount: +item.asCount || item.purchaseCount }))}
            size={size}
            orderType={orderType}
          />
        </View>
      ) : null}
      {dataSource.length === 1 ? (
        <>
          <View className={styles['asProductsPro-list-item-head']}>
            <AsProductsList dataSource={dataSource} size={size} orderType={orderType} />
          </View>
          <Cell
            customStyle={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
            border
          >
            <Cell.Item
              title={`${intl.formatMessage({
                id: 'afterTodo.components.asProductsPro.asCount',
                afterType: TITLE_MAP[afterType],
              })}：`}
              value={
                <Stepper
                  value={dataSource[0].asCount}
                  min={0}
                  max={dataSource[0].remaining}
                  onChange={(value: number) => handleStepperChange(value, dataSource[0].orderRecordId as number)}
                />
              }
              customHeadStyle={{
                paddingTop: pxTransform(8),
                paddingBottom: pxTransform(8),
              }}
            />
          </Cell>
        </>
      ) : null}
    </MellowCard>
  )
}

AsProductsPro.defaultProps = {
  customStyle: {},
  onSubmit: undefined,
  size: 'default',
}

export default AsProductsPro
