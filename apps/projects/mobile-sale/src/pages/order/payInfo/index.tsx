import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image, Icons, Toast } from '@apps/mobile-ui'
import { useRouter, pxTransform } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import InfoCard from '@/components/InfoCard'
import ChangeRatioPopup from '@/components/OrderComponents/ChangeRatioPopup'
import { getOrderMobileVendorDetail, postOrderMobileVendorValidateSubmitPaymentUpdate } from '@apps/apis'
import { ORDER_INNER_STATUS, ORDER_OUTER_STATUS } from '@/constants/const/order'
import { useImmer } from 'use-immer'
import styles from './index.module.scss'

type PayRatesType = {
  batchNo: string | number
  payRate: string | number
}

const mockStatusColor = {
  1: '#91959B',
  2: '#EB9B00',
}

const PayInfo = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const { showEditRatio, orderId } = useRouter().params
  const [visible, setVisible] = useState<boolean>(false)
  const [orderDetail, setOrderDetail] = useImmer<any>({ payments: [] })

  const batchNoRef = useRef<string | number>() // 记录最后一个修改的batchNo
  const payRatesRef = useRef<PayRatesType[]>([]) // 记录总体的修改参数

  const getOrderDetail = () => {
    if (orderId) {
      getOrderMobileVendorDetail({ orderId }).then(({ code, data }) => {
        if (code === 1000) {
          setOrderDetail(data)
          // 仅在支持修改支付比例的条件下初始化修改比例的参数
          if (showEditRatio && data.innerStatus === ORDER_INNER_STATUS.TO_BE_SUBMITTED) {
            const newPayRates: any = []
            data.payments?.forEach(({ batchNo, payRate }) => {
              newPayRates.push({
                batchNo,
                payRate,
              })
            })
            // 初始化修改比例的参数
            payRatesRef.current = newPayRates
          }
        }
      })
    }
  }

  // 保存修改
  const onConfirm = () => {
    if (orderId) {
      const params: any = {
        payRates: payRatesRef.current,
        orderId: Number(orderId),
      }
      postOrderMobileVendorValidateSubmitPaymentUpdate(params).then(({ code, message }) => {
        if (code === 1000) {
          Toast.show({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }), icon: 'none' })
          getOrderDetail()
          setVisible(false)
        }
      })
    }
  }

  // 修改支付比例弹窗确定回调
  const onChangeRatioConfirm = useCallback((payRate) => {
    if (batchNoRef.current && payRate) {
      const newPayRates: PayRatesType[] = [...payRatesRef.current]
      const index = newPayRates.findIndex((item) => item.batchNo === batchNoRef.current)
      // ~x大致等同于-(x+1)
      if (~index) {
        newPayRates[index].payRate = payRate
      }
      // 保存修改参数
      payRatesRef.current = newPayRates
      // 同时修改源数据里的支付比例
      setOrderDetail((draft) => {
        const paymentsIndex = draft.payments.findIndex((item) => item.batchNo === batchNoRef.current)
        draft.payments[paymentsIndex].payRate = payRate
      })
      setVisible(false)
    }
  }, [])

  const onClose = useCallback(() => setVisible(false), [])

  useEffect(() => {
    getOrderDetail()
  }, [])

  return (
    <View className={styles['container']}>
      <View style={{ flex: 1 }}>
        {orderDetail.payments.map((item) => (
          <InfoCard
            key={item.paymentId}
            title={
              <View className={styles['card-title']}>
                {item.payNode}
                <View className={styles['card-tag']}>
                  {intl.formatMessage({ id: 'order.di', defaultMessage: '第' })} {item.tag}{' '}
                  {intl.formatMessage({ id: 'order.count', defaultMessage: '次' })}
                </View>
              </View>
            }
            subtitle={<Text style={{ color: mockStatusColor[item.status] }}>{item.innerStatusName}</Text>}
          >
            <View className={styles['info-money']}>
              <View className={styles['label']}>
                {intl.formatMessage({ id: 'order.paymentAmount', defaultMessage: '支付金额' })}：
              </View>
              <View className={styles['money']}>¥{item.payAmount}</View>
            </View>
            <View className={styles[showEditRatio ? 'info-edit' : 'info']}>
              <>
                <View className={styles['label']}>
                  {intl.formatMessage({ id: 'order.paymentProportion', defaultMessage: '支付比例' })}：
                </View>
                <View className={styles['value']}>{item.payRate}%</View>
              </>
              {
                // 展示了修改比例且内部状态为待提交审核且为待支付状态
                showEditRatio &&
                  orderDetail.innerStatus === ORDER_INNER_STATUS.TO_BE_SUBMITTED &&
                  item.outerStatus === ORDER_OUTER_STATUS.TO_PAY && (
                    <View
                      className={styles['edit']}
                      onClick={() => {
                        batchNoRef.current = item.batchNo
                        setVisible(true)
                      }}
                    >
                      <Icons name="Edit" size={12} color="#00A98F" customStyle={{ marginLeft: pxTransform(2) }} />
                      <View className={styles['edit-text']}>
                        {intl.formatMessage({ id: 'common.edit', defaultMessage: '修改' })}
                      </View>
                    </View>
                  )
              }
            </View>
            <View className={styles['info']}>
              <View className={styles['label']}>
                {intl.formatMessage({ id: 'order.payType', defaultMessage: '支付方式' })}：
              </View>
              <View className={styles['value']}>{item.payChannelName}</View>
            </View>
            <View className={styles['info']}>
              <View className={styles['label']}>
                {intl.formatMessage({ id: 'order.payTime', defaultMessage: '支付时间' })}：
              </View>
              <View className={styles['value']}>{item.payTime}</View>
            </View>
            {!!item.vouchers?.length && (
              <View className={styles['info-img']}>
                <View className={styles['label']}>
                  {intl.formatMessage({ id: 'order.paymentVoucher', defaultMessage: '支付凭证' })}：
                </View>
                <View className={styles['value']}>
                  {item.vouchers?.map((voucherItem, index) => (
                    <Image key={index} src={voucherItem} className={styles['img']} />
                  ))}
                </View>
              </View>
            )}
          </InfoCard>
        ))}
      </View>
      {showEditRatio && orderDetail.innerStatus === ORDER_INNER_STATUS.TO_BE_SUBMITTED && (
        <View className={styles['btn-wrap']} style={{ paddingBottom: pxTransform(safeBottomHeight || 6) }}>
          <View className={styles['btn']} onClick={onConfirm}>
            {intl.formatMessage({ id: 'order.saveEdit', defaultMessage: '保存修改' })}
          </View>
        </View>
      )}
      <ChangeRatioPopup visible={visible} onClose={onClose} onConfirm={onChangeRatioConfirm} />
    </View>
  )
}

PayInfo.defaultProps = {
  showEditRatio: false,
}

export default PayInfo
