/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 13:57:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 10:55:42
 * @Description: 物流 发货 / 收货 信息，用于退货发货、收货；换货发货、收货批次信息展示
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Descriptions from '@/components/Descriptions'
import Progress from '@/components/Progress'
import Cell from '@/components/Cell'
import Stepper from '@/components/Stepper'
import AsProductsList from '../../../afterTodo/components/AsProductsList'
import styles from './index.module.scss'

export type LogisticsDetailItemType = {
  /**
   * 采购数量
   */
  purchaseCount?: number
  /**
   * 品牌
   */
  brand?: string
  /**
   * 分类
   */
  category?: string
  /**
   * 申请数量，退货、换货、维修申请数量
   */
  applyCount?: number
  /**
   * 发货数量
   */
  deliveryCount?: number
  /**
   * 差异数量
   */
  differenceCount?: number
  /**
   * 订单id
   */
  orderId?: number
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
  productName?: string
  /**
   * 入库数量
   */
  storageCount?: number
  /**
   * 单位
   */
  unit?: string
  /**
   * 商品主图
   */
  skuPic?: string
  /**
   * 订单商品记录
   */
  orderRecordId?: number
  /**
   * 操作数，eg 退货发货数、收货数
   */
  count?: number
  /**
   * 数据id
   */
  detailId?: number
}

export type ValueType = {
  /**
   * 商品id
   */
  productId: string | number
  /**
   * 操作数量
   */
  count: number
  /**
   * 订单商品记录id
   */
  orderRecordId: number
}

export interface LogisticsDetailItemProps {
  /**
   * 数据
   */
  data: LogisticsDetailItemType
  /**
   * 是否可编辑的，默认为 false
   */
  ediatable?: boolean
  /**
   * 进步器改变触发事件
   */
  onStepperChange?: (values: ValueType) => void
  /**
   * 售后类型 1 退货 2 换货 3 维修
   */
  afterType: 1 | 2 | 3
  /**
   * 流程类型，'returnDeliver' 退货发货，exchangeDeliver 换货发货，exchangeReceived 换货收货
   * 换货流程包含两个退货步骤，一是 退货发货，二是 换货发货
   * 退货流程包含一个退货步骤，一是 退货发货
   */
  flowType: 'returnDeliver' | 'exchangeDeliver' | 'exchangeReceived'
  /**
   * 订单类型
   */
  orderType: number
}

export const LogisticsDetailItem: React.FC<LogisticsDetailItemProps> = (props) => {
  const { data, ediatable, onStepperChange, afterType, flowType, orderType } = props

  const intl = useIntl()
  // 标题map
  const AFTER_TYPE_TITLE_MAP: { [key: number]: '退货' | '换货' | '维修' } = {
    1: intl.formatMessage({
      id: 'afterRecords.components.logisticsDetailList.afterType.refund',
      defaultMessage: '退货',
    }),
    2: intl.formatMessage({
      id: 'afterRecords.components.logisticsDetailList.afterType.exchange',
      defaultMessage: '换货',
    }),
    3: intl.formatMessage({
      id: 'afterRecords.components.logisticsDetailList.afterType.repair',
      defaultMessage: '维修',
    }),
  }

  // 流程map
  const FLOW_TYPE_NAME_MAP = {
    exchangeDeliver: intl.formatMessage({
      id: 'afterRecords.components.logisticsDetailList.flowType.refund',
      defaultMessage: '退货',
    }),
    returnDeliver: intl.formatMessage({
      id: 'afterRecords.components.logisticsDetailList.flowType.refund',
      defaultMessage: '退货',
    }),
    exchangeReceived: intl.formatMessage({
      id: 'afterRecords.components.logisticsDetailList.flowType.exchange',
      defaultMessage: '换货',
    }),
  }

  const handleStepperChange = (value: number) => {
    if (onStepperChange) {
      onStepperChange({
        productId: data.productId!,
        orderRecordId: data.orderRecordId!,
        count: value,
      })
    }
  }

  return (
    <MellowCard>
      <AsProductsList
        dataSource={[
          {
            orderId: data.orderId as number,
            orderNo: data.orderNo as string,
            productId: data.productId as string,
            productName: data.productName as string,
            skuPic: data.skuPic!,
            unit: data.unit!,
            skuId: 0,
            remaining: 0,
          },
        ]}
        customRenderDescription={() => (
          <Descriptions.Item
            label={`${intl.formatMessage({
              id: 'afterRecords.components.logisticsDetailList.applyCount',
              afterType: AFTER_TYPE_TITLE_MAP[afterType],
            })}(${data.unit})`}
            customStyle={{
              marginBottom: pxTransform(0),
            }}
          >
            {data.applyCount}
          </Descriptions.Item>
        )}
        orderType={orderType}
      />
      {!ediatable ? (
        <>
          <View className={styles['logisticsDetailList-item-desc']}>
            <View className={styles['logisticsDetailList-item-desc-left']}>
              <Descriptions.Item
                label={`${intl.formatMessage({
                  id: 'afterRecords.components.logisticsDetailList.deliveryCount',
                  flowType: FLOW_TYPE_NAME_MAP[flowType],
                })}(${data.unit})`}
                customStyle={{
                  marginBottom: pxTransform(0),
                }}
                customContentWrapStyle={{
                  flex: 0,
                }}
              >
                {data.deliveryCount}
              </Descriptions.Item>
            </View>
            <View className={styles['logisticsDetailList-item-desc-right']}>
              <Descriptions.Item
                label={`${intl.formatMessage({
                  id: 'afterRecords.components.logisticsDetailList.storageCount',
                  flowType: FLOW_TYPE_NAME_MAP[flowType],
                })}(${data.unit})`}
                customStyle={{
                  marginBottom: pxTransform(0),
                }}
                customContentWrapStyle={{
                  flex: 0,
                }}
              >
                {data.storageCount}
              </Descriptions.Item>
            </View>
          </View>
          <View className={styles['logisticsDetailList-item-progress']}>
            <Progress
              percent={data.deliveryCount ? (data.storageCount || 0 / data.deliveryCount!) * 100 : 0}
              showInfo={false}
            />
          </View>
        </>
      ) : (
        <Cell
          customStyle={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          customClassName={styles['logisticsDetailList-item-progress']}
          border={false}
        >
          <Cell.Item
            title={`${intl.formatMessage({
              id: 'afterRecords.components.logisticsDetailList.count',
              afterType: AFTER_TYPE_TITLE_MAP[afterType],
            })}(${data.unit})`}
            customTitleStyle={{
              color: '#252D37',
            }}
            value={
              <Stepper
                value={data.count}
                min={0.001}
                max={data.purchaseCount}
                onBlur={handleStepperChange}
                onPlus={handleStepperChange}
                onMinus={handleStepperChange}
              />
            }
            customHeadStyle={{
              paddingTop: pxTransform(0),
              paddingBottom: pxTransform(0),
            }}
          />
        </Cell>
      )}
    </MellowCard>
  )
}

export interface LogisticsDetailListProps {
  /**
   * 数据源
   */
  dataSource: LogisticsDetailItemType[]
  /**
   * 是否可编辑的
   */
  ediatable?: LogisticsDetailItemProps['ediatable']
  /**
   * 进步器改变触发事件
   */
  onStepperChange?: (values: LogisticsDetailItemType[]) => void
  /**
   * 售后类型 1 退货 2 换货 3 维修
   */
  afterType: LogisticsDetailItemProps['afterType']
  /**
   * 流程类型，'returnDeliver' 退货发货，exchangeDeliver 换货发货
   * 换货流程包含两个退货步骤，一是 退货发货，二是 换货发货
   * 退货流程包含一个退货步骤，一是 退货发货
   */
  flowType: LogisticsDetailItemProps['flowType']
  /**
   * 订单类型
   */
  orderType: number
}

const LogisticsDetailList: React.FC<LogisticsDetailListProps> = (props: LogisticsDetailListProps) => {
  const { dataSource, ediatable, onStepperChange, afterType, flowType, orderType } = props

  const intl = useIntl()

  const handleStepperChange = (value: ValueType) => {
    const newData = [...dataSource]
    const index = dataSource.findIndex((item) => item.orderRecordId === value.orderRecordId)
    if (index !== -1) {
      newData.splice(index, 1, {
        ...newData[index],
        count: value.count,
      })
    }
    onStepperChange?.(newData)
  }

  return (
    <View className={styles['logisticsDetailList']}>
      {dataSource.map((item, index) => (
        <View className={styles['logisticsDetailList-item']} key={index}>
          <LogisticsDetailItem
            data={item}
            ediatable={ediatable}
            onStepperChange={handleStepperChange}
            afterType={afterType}
            flowType={flowType}
            orderType={orderType}
          />
        </View>
      ))}
      <View className={styles['logisticsDetailList-quantity']}>
        {intl.formatMessage({ id: 'afterRecords.components.logisticsDetailList.length', length: dataSource.length })}
      </View>
    </View>
  )
}

export default LogisticsDetailList
