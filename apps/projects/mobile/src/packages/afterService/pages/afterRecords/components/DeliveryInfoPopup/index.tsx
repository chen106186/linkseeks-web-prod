/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 15:10:13
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 14:32:12
 * @Description: 退货发货信息 Popup
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import Cell from '@/components/Cell'
import Router from '@/utils/router'
import Gap from '../../components/Gap'
import styles from './index.module.scss'

export interface DeliveryData {
  /**
   * 发货单号
   */
  deliveryNo?: string
  /**
   * 发货单Id
   */
  deliveryNoId?: number
  /**
   * 发货时间
   */
  deliveryTime?: string
  /**
   * 物流id
   */
  logisticsId?: number
  /**
   * 物流单号
   */
  logisticsOrderNo?: string
  /**
   * 物流公司
   */
  logisticsName?: string
  /**
   * 入库单号
   */
  storageNo?: string
  /**
   * 入库单id
   */
  storageId?: number
  /**
   * 入库时间
   */
  storageTime?: string
}

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 当前值
   */
  data: DeliveryData
  /**
   * 场景类型，可选 refund | exchange，默认 refund
   */
  type?: 'refund' | 'exchange'
  /**
   * 场景角色类型，可选 sender寄件人 | addressee 收件人，默认 sender
   */
  roleType?: 'sender' | 'addressee'
}

export const useAfterTypeName = () => {
  const intl = useIntl()

  const AFTER_TYPE_NAME_MAP = {
    refund: intl.formatMessage({ id: 'afterRecords.components.deliveryInfoPopup.refund', defaultMessage: '退货' }),
    exchange: intl.formatMessage({
      id: 'afterRecords.components.deliveryInfoPopup.exchange',
      defaultMessage: '换货',
    }),
  }
  return AFTER_TYPE_NAME_MAP
}

const DeliveryInfoPopup: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose, data, type = 'refund', roleType = 'sender' } = props

  const intl = useIntl()
  const AFTER_TYPE_NAME_MAP = useAfterTypeName()

  const typeName = AFTER_TYPE_NAME_MAP[type]
  const isSender = roleType === 'sender'

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleJumpBillDetails = (billId: number) => {
    handleClose()
    // navigation.navigate(type === 'refund' ? 'ReturnInvoiceDetail' : 'ExchangeInvoiceDetail', {
    //   returnDeliveryId: billId,
    // });
  }

  const handleJumpLogisticsBillDetail = (logisticsId: number, logisticsOrderNo: string) => {
    // 手工发货物流单号，跳转到快递100
    if (logisticsOrderNo && !logisticsId) {
      handleClose()
      Router.navigateToKuaiDi100(logisticsOrderNo)
    }
    if (!logisticsId) {
      return
    }
    handleClose()
    // navigation.navigate('LogisticsBillDetail', {
    //   logisticsId,
    // });
  }

  const deliveryInfo = [
    {
      key: 1,
      title: intl.formatMessage({ id: 'afterRecords.components.deliveryInfoPopup.deliveryNo', typeName: typeName }),
      value: data.deliveryNo,
      hasArrow: isSender,
      clickable: isSender,
      onPress: () => handleJumpBillDetails(data.deliveryNoId!),
    },
    {
      key: 2,
      title: intl.formatMessage({
        id: 'afterRecords.components.deliveryInfoPopup.deliveryTime',
        defaultMessage: '发货时间',
      }),
      value: data.deliveryTime,
    },
    {
      key: 3,
      title: intl.formatMessage({
        id: 'afterRecords.components.deliveryInfoPopup.logisticsOrderNo',
        defaultMessage: '物流单号',
      }),
      value: data.logisticsOrderNo,
      hasArrow: isSender || !!(!data.logisticsId && data.logisticsOrderNo),
      clickable: isSender || !!(!data.logisticsId && data.logisticsOrderNo),
      onPress: () => handleJumpLogisticsBillDetail(data.logisticsId!, data.logisticsOrderNo!),
    },
    {
      key: 4,
      title: intl.formatMessage({
        id: 'afterRecords.components.deliveryInfoPopup.logisticsName',
        defaultMessage: '物流公司',
      }),
      value: data.logisticsName,
    },
  ]

  const warehouseInfo = [
    {
      key: 1,
      title: intl.formatMessage({ id: 'afterRecords.components.deliveryInfoPopup.storageNo', typeName: typeName }),
      value: data.storageNo,
      hasArrow: !isSender,
      clickable: !isSender,
      onPress: () => handleJumpBillDetails(data.storageId!),
    },
    {
      key: 2,
      title: intl.formatMessage({
        id: 'afterRecords.components.deliveryInfoPopup.storageTime',
        defaultMessage: '入库时间',
      }),
      value: data.storageTime,
    },
  ]

  return (
    <Popup
      title={intl.formatMessage({ id: 'afterRecords.components.deliveryInfoPopup.title', typeName: typeName })}
      visible={visible}
      onClose={handleClose}
      customStyle={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <View className={styles['delivery-info']}>
        <View className={styles['delivery-info-item']}>
          <View className={styles['delivery-info-item-title']}>
            {intl.formatMessage({ id: 'afterRecords.components.deliveryInfoPopup.title', typeName: typeName })}
          </View>
          <View className={styles['delivery-info-item-content']}>
            <Cell transposition>
              {deliveryInfo.map((item) => (
                <Cell.Item
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  hasArrow={item.hasArrow}
                  clickable={item.clickable}
                  onPress={item.onPress}
                  border
                />
              ))}
            </Cell>
          </View>
        </View>
        <View className={styles['delivery-info-item']}>
          <View className={styles['delivery-info-item-title']}>
            {intl.formatMessage({ id: 'afterRecords.components.deliveryInfoPopup.warehouseInfo', typeName: typeName })}
          </View>
          <View className={styles['delivery-info-item-content']}>
            <Cell transposition>
              {warehouseInfo.map((item) => (
                <Cell.Item
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  hasArrow={item.hasArrow}
                  clickable={item.clickable}
                  onPress={item.onPress}
                  border
                />
              ))}
            </Cell>
          </View>
        </View>
      </View>
      <Gap height={30} />
    </Popup>
  )
}

DeliveryInfoPopup.defaultProps = {
  type: 'refund',
  roleType: 'sender',
}

export default DeliveryInfoPopup
