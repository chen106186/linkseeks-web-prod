/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 15:01:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 14:58:51
 * @Description: 物流信息卡片，用于退货发货、收货；换货发货、收货批次信息展示
 */
import React, { useState } from 'react'
import cx from 'classnames'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Icons } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Descriptions from '@/components/Descriptions'
import Copy from '@/components/Copy'
import { LogisticsDetailItemType } from '../LogisticsDetailList'
import RefundDeliveryInfoPopup, { DeliveryData, useAfterTypeName } from '../DeliveryInfoPopup'
import styles from './index.module.scss'
import { DetailsData } from '../../exchangeRecords/exchangeDetails'

export type LogisticsData = {
  /**
   * 发货Id
   */
  deliveryId: number
  /**
   * 批次
   */
  batch: number
  /**
   * 发货单Id
   */
  deliveryNoId: number
  /**
   * 发货单号
   */
  deliveryNo: string
  /**
   * 发货时间（yyyy-MM-ddHH:mm）
   */
  deliveryTime: string
  /**
   * 物流id
   */
  logisticsId: number
  /**
   * 物流单号
   */
  logisticsOrderNo: string
  /**
   * 物流公司
   */
  logisticsName: string
  /**
   * 物流发货地址
   */
  shipperFullAddress: string
  /**
   * 入库单号
   */
  storageNo: string
  /**
   * 入库单号
   */
  storageId: number
  /**
   * 入库时间（yyyy-MM-ddHH:mm）
   */
  storageTime: string
  /**
   * 内部状态:未确认发货-1,已确认发货-2,已确认收货-3,确认回单-4
   */
  innerStatus: number
  /**
   * 内部状态名称
   */
  innerStatusName: string
  /**
   * 发货明细
   */
  detailList: LogisticsDetailItemType[]
}

interface LogisticsCardProps {
  details: DetailsData
  /**
   * 数据，数据待定
   */
  data: LogisticsData
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 是否是选中的
   */
  isActive?: boolean
  /**
   * 场景类型，可选 refund | exchange，默认 refund
   */
  type?: 'refund' | 'exchange'
  /**
   * 场景角色类型，可选 sender寄件人 | addressee 收件人，默认 sender
   */
  roleType?: 'sender' | 'addressee'
  /**
   * 点击显示发货信息触发事件
   */
  onShowDeliverInfo: () => void
}

const LogisticsCard: React.FC<LogisticsCardProps> = (props: LogisticsCardProps) => {
  const { data, details, customStyle, isActive, type = 'refund', roleType = 'sender', onShowDeliverInfo } = props
  // const [visible, setVisible] = useState(false);
  // const [current, setCurrent] = useState<DeliveryData>();

  const intl = useIntl()
  const AFTER_TYPE_NAME_MAP = useAfterTypeName()

  // const handleVisiblePopup = (flag?: boolean) => {
  //   setVisible(!!flag);
  // };

  const handleShowDeliverInfo = (record: LogisticsData) => {
    // setCurrent(record);
    // handleVisiblePopup(true);
    onShowDeliverInfo?.()
  }

  return (
    <>
      <MellowCard
        title={
          <View className={styles['logisticsCard-titleWrap']}>
            <Text className={styles['logisticsCard-title']}>{data.deliveryNo || data.logisticsOrderNo}</Text>
            {(data.deliveryNo || data.logisticsOrderNo) && <Copy text={data.deliveryNo || data.logisticsOrderNo} />}
          </View>
        }
        extra={<Text className={styles['logisticsCard-extra']}>{data.innerStatusName}</Text>}
        headStyle={{
          borderBottomWidth: pxTransform(0),
        }}
        bodyStyle={{
          paddingTop: pxTransform(0),
        }}
        className={cx(styles['logisticsCard'], isActive ? styles['logisticsCard-active'] : '')}
        style={customStyle}
      >
        <View className={styles['logisticsCard-cell']} onClick={() => handleShowDeliverInfo(data)}>
          <View className={styles['logisticsCard-cell-label']}>
            {data.logisticsName && <View className={styles['logisticsCard-cell-tag']}>{data.logisticsName}</View>}
          </View>
          <View className={styles['logisticsCard-cell-arrow']}>
            <Icons name="ChevronRight" color="#909399" size={14} />
          </View>
        </View>
        {roleType === 'sender' ? (
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterRecords.components.logisticsCard.deliveryTime',
                defaultMessage: '发货时间',
              })}
            >
              {data.deliveryTime}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterRecords.components.logisticsCard.shipperFullAddress',
                defaultMessage: '发货地址',
              })}
              customStyle={{ marginBottom: pxTransform(0) }}
            >
              {`${details?.returnGoodsAddress.sendUserName || ''} / ${
                details?.returnGoodsAddress.sendUserTel || ''
              } / ${details?.returnGoodsAddress.sendAddress || ''}`}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterRecords.components.logisticsCard.deliveryTime2',
                afterType: AFTER_TYPE_NAME_MAP[type],
              })}
            >
              {data.deliveryTime}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterRecords.components.logisticsCard.storageTime',
                afterType: AFTER_TYPE_NAME_MAP[type],
              })}
              customStyle={{ marginBottom: pxTransform(0) }}
            >
              {`${details?.replaceGoodsAddress.receiveUserName || ''} / ${
                details?.replaceGoodsAddress.receiveUserTel || ''
              } / ${details?.replaceGoodsAddress.receiveAddress || ''}`}
            </Descriptions.Item>
          </Descriptions>
        )}
      </MellowCard>

      {/* <RefundDeliveryInfoPopup
        visible={visible}
        data={{
          deliveryNo: current?.deliveryNo,
          deliveryNoId: current?.deliveryNoId,
          deliveryTime: current?.deliveryTime,
          logisticsId: current?.logisticsId,
          logisticsOrderNo: current?.logisticsOrderNo,
          logisticsName: current?.logisticsName,
          storageNo: current?.storageNo,
          storageId: current?.storageId,
          storageTime: current?.storageTime,
        }}
        onClose={() => handleVisiblePopup(false)}
        type={type}
        roleType={roleType}
      /> */}
    </>
  )
}

LogisticsCard.defaultProps = {
  customStyle: {},
  isActive: false,
  type: 'refund',
  roleType: 'sender',
}

export default LogisticsCard
