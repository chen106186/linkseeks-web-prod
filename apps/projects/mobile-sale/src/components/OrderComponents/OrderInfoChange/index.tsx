import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Toast, View } from '@apps/mobile-ui'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { Input, Textarea } from '@tarojs/components'
import { postOrderMobileVendorValidateSubmitFreightUpdate } from '@apps/apis'
import Router from '@/utils/router'
import { limitDecimals } from '@/utils'
import { useImmer } from 'use-immer'
import styles from './index.module.scss'

// 单价 | 运费
export type PageType = 'PRICE' | 'FREIGHT'

type PropsType = {
  pageType: PageType
  inputTitle: React.ReactNode
}

type ParamsType = {
  price: string
  reason: string
}

enum PAGE_TYPE {
  PRICE = 'PRICE',
  FREIGHT = 'FREIGHT',
}

const OrderInfoChange = ({ pageType, inputTitle }: PropsType) => {
  const intl = useIntl()
  const { orderId, orderProductId } = useRouter().params
  const [inputParams, setInputParams] = useImmer<ParamsType>({
    price: '',
    reason: '',
  })

  const onConfirm = () => {
    const params: any = { orderId }
    switch (pageType) {
      case PAGE_TYPE.PRICE:
        params.prices = [
          {
            orderProductId,
            ...inputParams,
          },
        ]
        break
      case PAGE_TYPE.FREIGHT:
        params.freight = inputParams.price
        params.reason = inputParams.reason
        console.log('params', params)
        break
    }
    postOrderMobileVendorValidateSubmitFreightUpdate(params).then(({ code, message }) => {
      if (code === 1000) {
        Toast.show({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }), icon: 'none' })
        setTimeout(() => {
          Router.navigateBack()
        }, 500)
      }
    })
  }

  const inputChange = (key: 'price' | 'reason', value: string) => {
    // 处理金额数值
    if (key === 'price') {
      value = limitDecimals(value, pageType === PAGE_TYPE.PRICE ? 3 : 2)
    }
    setInputParams((draft) => {
      draft[key] = value
    })
  }

  return (
    <View className={styles['container']}>
      <View className={styles['input-wrap']}>
        <View className={styles['title']}>{inputTitle}</View>
        <View className={styles['input']}>
          <Input
            placeholder={intl.formatMessage({ id: 'common.clickEnter', defaultMessage: '点击输入' })}
            type="digit"
            value={inputParams.price}
            onInput={(e) => inputChange('price', e.detail.value)}
          />
        </View>
      </View>
      <View className={styles['remark-wrap']}>
        <Textarea
          placeholder={`${intl.formatMessage({
            id: 'common.input.enter',
            defaultMessage: '请输入',
          })}${intl.formatMessage({ id: 'order.editReason', defaultMessage: '修改原因' })}`}
          value={inputParams.reason}
          maxlength={120}
          onInput={(e) => inputChange('reason', e.detail.value)}
        />
      </View>
      <View className={styles['btn-wrap']} onClick={onConfirm}>
        {intl.formatMessage({ id: 'common.handle.confirm', defaultMessage: '确定' })}
      </View>
    </View>
  )
}

export default OrderInfoChange
