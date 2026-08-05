/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-05 17:41:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-09 13:44:58
 * @Description: 理由弹窗
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Text, View, ScrollView, Radio } from '@apps/mobile-ui'
import { IRequestSuccess } from '@/types/request'
import {
  getAftersalesMobileReturnGoodsGetReasonList,
  getAftersalesMobileReplaceGoodsGetReasonList,
  getAftersalesMobileRepairGoodsGetReasonList,
} from '@apps/apis'
import Popup from '@/components/Popup'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import styles from './index.module.scss'

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

  value?: string
  /**
   * 选项改变触发事件
   */
  onChange?: (value: string) => void
}

type ReasonItem = {
  /**
   * 数据id
   */
  id: number
  /**
   * 文本
   */
  text: string
}

const API_MAP: { [key: number]: () => Promise<IRequestSuccess<ReasonItem[]>> } = {
  1: getAftersalesMobileReturnGoodsGetReasonList,
  2: getAftersalesMobileReplaceGoodsGetReasonList,
  3: getAftersalesMobileRepairGoodsGetReasonList,
}

const ReasonPopup: React.FC<IProps> = (props: IProps) => {
  const { afterType, visible, onClose, value, onChange } = props
  const [current, setCurrent] = useState('')
  const { OTHER_REASON_KEY } = useAfterServiceConst()

  const [list, setList] = useState<ReasonItem[]>([
    {
      id: -1,
      text: OTHER_REASON_KEY,
    },
  ])

  const intl = useIntl()

  // 标题map
  const TITLE_MAP: { [key: number]: '退货' | '换货' | '维修' } = {
    1: intl.formatMessage({ id: 'afterTodo.components.reasonPopup.type.refund', defaultMessage: '退货' }),
    2: intl.formatMessage({ id: 'afterTodo.components.reasonPopup.type.exchange', defaultMessage: '换货' }),
    3: intl.formatMessage({ id: 'afterTodo.components.reasonPopup.type.repair', defaultMessage: '维修' }),
  }

  const getReasonList = () => {
    API_MAP[afterType]().then((res) => {
      if (res.code) {
        setList(
          res.data.concat({
            id: -1,
            text: OTHER_REASON_KEY,
          }),
        )
      }
    })
  }

  useEffect(() => {
    getReasonList()
  }, [])

  useEffect(() => {
    if ('value' in props) {
      setCurrent(value as string)
    }
  }, [value])

  const triggerChange = (next: string) => {
    if (onChange) {
      onChange(next)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleReasonChange = (next: string) => {
    setCurrent(next)
    triggerChange(next)
    handleClose()
  }

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={intl.formatMessage({ id: 'afterTodo.components.reasonPopup.reason', afterType: TITLE_MAP[afterType] })}
      zIndex={105}
      customStyle={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <View className={styles['reason-popup']}>
        <Radio.Group value={current} customStyle={{ width: '100%' }} onChange={handleReasonChange}>
          <ScrollView className={styles['reason-popup-list']}>
            {list.map((item) => (
              <View
                key={item.id}
                className={styles['reason-popup-list-item']}
                onClick={() => handleReasonChange(item.text)}
              >
                <View className={styles['reason-popup-list-item-center']}>
                  <Text className={styles['reason-popup-list-item-title']}>{item.text}</Text>
                </View>
                <View className={styles['reason-popup-list-item-right']}>
                  <Radio value={item.text} />
                </View>
              </View>
            ))}
            {/* <Gap height={safeInset.bottom || 40} /> */}
          </ScrollView>
        </Radio.Group>
      </View>
    </Popup>
  )
}

ReasonPopup.defaultProps = {
  onChange: undefined,
}

export default ReasonPopup
