import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Toast } from '@apps/mobile-ui'
import { setNavigationBarTitle, useRouter } from '@apps/mobile-services/utils/taro'
import { Textarea } from '@tarojs/components'
import {
  getOrderMobileVendorDetail,
  postOrderMobileVendorValidateSubmit,
  postOrderMobileVendorValidateGradeOne,
  postOrderMobileVendorValidateGradeTwo,
  postOrderMobileVendorValidateConfirm,
} from '@apps/apis'
import { ORDER_INNER_STATUS } from '@/constants/const/order'
import Router from '@/utils/router'
import cs from 'classnames'
import styles from './index.module.scss'

enum TYPE {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
}

const AGREE_VALUE = {
  [TYPE.AGREE]: 1, // 审核通过
  [TYPE.DISAGREE]: 0, // 审核不通过
}

const API = {
  [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: postOrderMobileVendorValidateSubmit,
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: postOrderMobileVendorValidateGradeOne,
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: postOrderMobileVendorValidateGradeTwo,
  [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: postOrderMobileVendorValidateConfirm,
}

const OrderExamineConfirm = () => {
  const intl = useIntl()
  const { type, orderId } = useRouter().params
  const [reason, setReason] = useState<string>('')

  const orderDetailRef = useRef<any>()

  const TYPE_TEXT = {
    AGREE: {
      title: intl.formatMessage({ id: 'order.passReason', defaultMessage: '审核通过原因' }),
      tips: intl.formatMessage({ id: 'order.pass', defaultMessage: '订单审核通过' }),
      placeholder: intl.formatMessage({ id: 'order.reason', defaultMessage: '请输入原因' }),
    },
    DISAGREE: {
      title: intl.formatMessage({ id: 'order.noPassReason', defaultMessage: '审核不通过原因' }),
      tips: intl.formatMessage({ id: 'order.noPass', defaultMessage: '订单审核不通过' }),
      placeholder: `${intl.formatMessage({ id: 'order.reason', defaultMessage: '请输入原因' })}(${intl.formatMessage({
        id: 'order.required',
        defaultMessage: '必填',
      })})`,
    },
  }

  const getOrderDetail = () => {
    if (orderId) {
      getOrderMobileVendorDetail({ orderId }).then(({ code, data }) => {
        if (code === 1000) {
          orderDetailRef.current = data
        }
      })
    }
  }

  const onConfirm = () => {
    if (type === TYPE.DISAGREE && !reason) return
    if (type && orderId) {
      const params = {
        orderId: Number(orderId),
        agree: AGREE_VALUE[type],
        reason,
      }
      API[orderDetailRef.current?.innerStatus](params).then(({ code }) => {
        if (code === 1000) {
          Toast.show({ title: TYPE_TEXT[type]?.tips, icon: 'none' })
          setTimeout(() => {
            Router.redirectTo('root/orderExamine/orderExamineList')
          }, 500)
        }
      })
    }
  }

  useEffect(() => {
    setNavigationBarTitle({ title: TYPE_TEXT[type as string]?.title })
    getOrderDetail()
  }, [])

  return (
    <View className={styles['container']}>
      <View className={styles['remark-wrap']}>
        <Textarea
          placeholder={TYPE_TEXT[type as string]?.placeholder}
          value={reason}
          maxlength={120}
          onInput={(e) => setReason(e.detail.value)}
        />
      </View>
      <View
        className={cs(styles['btn-wrap'], type === TYPE.DISAGREE && !reason && styles['btn-wrap-disable'])}
        onClick={onConfirm}
      >
        {intl.formatMessage({ id: 'common.handle.confirm', defaultMessage: '确定' })}
      </View>
    </View>
  )
}

export default OrderExamineConfirm
