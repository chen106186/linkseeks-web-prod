import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Text, View, ScrollView, Radio } from '@apps/mobile-ui'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import Popup from '@/components/Popup'
import styles from './index.module.scss'

export type DeliverItemType = {
  /**
   * 名称
   */
  name: string
  /**
   * 描述
   */
  description: string
  /**
   * key
   */
  key: number
}

interface IProps {
  /**
   * 售后类型 1 退货 2 换货 3 维修
   */
  afterType: 1 | 2 | 3
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

  value?: number
  /**
   * 选项改变触发事件
   */
  onChange?: (value: number) => void
}

const DeliverTypePopup: React.FC<IProps> = (props: IProps) => {
  const intl = useIntl()

  const deliverList: DeliverItemType[] = [
    {
      name: intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.logistics.name',
        defaultMessage: '自行寄回',
      }),
      description: intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.logistics.description',
        defaultMessage: '商家同意售后申请后，将补充寄回地址',
      }),
      key: DELIVERY_TYPE_ENUM.LOGISTICS,
    },
    {
      name: intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.self_pickup.name',
        defaultMessage: '上门取货',
      }),
      description: intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.self_pickup.description',
        defaultMessage: '商家同意售后申请后，将为您上门取货，具体日期可与商家沟通',
      }),
      key: DELIVERY_TYPE_ENUM.SELF_PICKUP,
    },
    {
      name: intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.no_delivery.name',
        defaultMessage: '无需配送',
      }),
      description: intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.no_delivery.description',
        defaultMessage: '商家同意售后申请后，将补充寄回地址',
      }),
      key: DELIVERY_TYPE_ENUM.NO_DELIVERY,
    },
  ]

  const { afterType, visible, onClose, value, onChange } = props
  const [current, setCurrent] = useState(0)
  const [list] = useState<DeliverItemType[]>(deliverList)

  // 标题map
  const TITLE_MAP: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'afterRecords.components.deliverTypePopup.refund', defaultMessage: '退货' }),
    2: intl.formatMessage({ id: 'afterRecords.components.deliverTypePopup.exchange', defaultMessage: '换货' }),
    3: intl.formatMessage({ id: 'afterRecords.components.deliverTypePopup.repair', defaultMessage: '维修' }),
  }

  useEffect(() => {
    if ('value' in props) {
      setCurrent(value as number)
    }
  }, [value])

  const triggerChange = (next: number) => {
    if (onChange) {
      onChange(next)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleReasonChange = (next: number) => {
    setCurrent(next)
    triggerChange(next)
    handleClose()
  }

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={intl.formatMessage({
        id: 'afterRecords.components.deliverTypePopup.title',
        afterType: TITLE_MAP[afterType],
      })}
      customStyle={{
        backgroundColor: '#FFFFFF',
      }}
      zIndex={105}
    >
      <View className={styles['deliverTypePopup']}>
        <Radio.Group value={current} onChange={handleReasonChange}>
          <ScrollView className={styles['deliverTypePopup-list']}>
            {list.map((item) => (
              <View
                key={item.key}
                className={styles['deliverTypePopup-list-item']}
                onClick={() => handleReasonChange(item.key)}
              >
                <View className={styles['deliverTypePopup-list-item-center']}>
                  <Text className={styles['deliverTypePopup-list-item-title']}>{item.name}</Text>
                  <Text className={styles['deliverTypePopup-list-item-desc']}>{item.description}</Text>
                </View>
                <View className={styles['deliverTypePopup-list-item-right']}>
                  <Radio value={item.key} />
                </View>
              </View>
            ))}
          </ScrollView>
        </Radio.Group>
      </View>
    </Popup>
  )
}

DeliverTypePopup.defaultProps = {
  onChange: undefined,
}

export default DeliverTypePopup
