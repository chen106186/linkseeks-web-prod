import React, { memo, useState, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { View, Text } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import Popup from '@/components/Popup'

import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  datas?: any
  /**
   * 弹窗类型
   * 1 配送方式 2 选择直送/自提
   */
  type: 1 | 2
  onClose: Function
  onOk: Function
  value?: any
  deliveryMethodValue?: any
}

const mixData = {
  1: { title: '选择配送方式', text: '配送方式', keys: 'deliveryMethods' },
  2: { title: '选择直送/自提', text: '直送/自提', keys: 'deliveryTypes' },
}

const DeliveryPopup: React.FC<PropsType> = (props: PropsType) => {
  const { visible, datas, onClose, onOk, type, value, deliveryMethodValue } = props
  const { safeBottomHeight } = useSafeArea()
  const [record, setRecord] = useState<any>()

  useEffect(() => {
    setRecord(value)
  }, [value])

  const _data = useMemo(() => {
    if (datas) {
      let _list = datas[mixData[type]['keys']]?.map((item) => {
        return {
          title: item?.deliveryMethodName ?? item?.deliveryTypeName,
          value: item?.deliveryMethod ?? item?.deliveryType,
        }
      })
      if (type === 2) {
        _list = _list.filter((item) => item.value === deliveryMethodValue)
      }
      return _list
    } else {
      return []
    }
  }, [type, datas, deliveryMethodValue])

  const handleClick = (item) => {
    if (type === 2 && deliveryMethodValue && deliveryMethodValue !== item.value) {
      return
    }
    if (item.value === record?.value) {
      setRecord(null)
    } else {
      setRecord(item)
    }
  }

  const handleSubmit = () => {
    onOk(record)
    onClose?.()
  }

  return (
    <Popup
      title={mixData[type].title}
      closeable
      visible={visible}
      onClose={() => onClose?.()}
      customStyle={{ height: '70vh' }}
    >
      <View
        className={styles['deliveryPopup']}
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
      >
        <View className={styles['deliveryPopup-outer']}>
          <Text className={styles['deliveryPopup-outer-title']}>{mixData[type].text}</Text>
          <View className={styles['deliveryPopup-outer-box']}>
            {_data?.map((item, index) => {
              return (
                <View
                  className={cx(
                    styles['deliveryPopup-outer-box-btn'],
                    record?.value === item.value ? styles['activeBtn'] : '',
                  )}
                  key={`${mixData[type].keys}_${index}`}
                  onClick={() => {
                    handleClick(item)
                  }}
                >
                  <Text
                    className={cx(
                      styles['deliveryPopup-outer-box-btn-text'],
                      record?.value === item.value ? styles['active'] : '',
                    )}
                  >
                    {item.title}
                  </Text>
                </View>
              )
            })}
          </View>
          <View className={styles['deliveryPopup-outer-fixedBtn']} onClick={handleSubmit}>
            <Text className={styles['deliveryPopup-outer-fixedBtn-text']}>确定</Text>
          </View>
        </View>
      </View>
    </Popup>
  )
}

DeliveryPopup.defaultProps = {
  visible: false,
  type: 1,
}

export default memo(DeliveryPopup)
