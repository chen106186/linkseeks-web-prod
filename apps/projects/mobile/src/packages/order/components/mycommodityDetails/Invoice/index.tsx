import React, { useState } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import { useIntl } from '@linkseeks/i18n'
import { GetOrderMobileBuyerDetailResponse } from '@apps/apis'
import { INVOICE_KIND } from '@/constants/const/invoice'
import styles from './index.module.scss'

interface Iprops {
  onHandleClose: (item: any) => void
  onConfirm: (value: { [key: string]: number }) => void
  cancelOrderVisible: boolean
  invoice: GetOrderMobileBuyerDetailResponse['invoice']
}

const Invoice = (props: Iprops) => {
  const { cancelOrderVisible, onHandleClose, onConfirm, invoice } = props
  const intl = useIntl()
  const handleClose = () => {
    onHandleClose(!cancelOrderVisible)
  }
  /* 个人 */
  const personal = () => (
    <View className={styles['cell']}>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'issuance_type', defaultMessage: '开具类型' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.invoiceTypeName}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoiceTitle', defaultMessage: '发票抬头' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.title}</Text>
      </View>
    </View>
  )
  /* 企业 */
  const enterprise = () => (
    <View className={styles['cell']}>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'issuance_type', defaultMessage: '开具类型' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.invoiceTypeName}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoice_type', defaultMessage: '发票种类' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.invoiceKindName}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoiceTitle', defaultMessage: '发票抬头' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.title}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'tax_id_code', defaultMessage: '纳税号' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.taxNo}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoice_bank', defaultMessage: '开户行' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.bank}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoice_account', defaultMessage: '账号' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.account}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoice_address', defaultMessage: ' 地址' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.address}</Text>
      </View>
      <View className={styles['cell-item']}>
        <Text className={styles['cell-name']}>
          {intl.formatMessage({ id: 'invoice_tel', defaultMessage: '电话号码' })}
        </Text>
        <Text className={styles['cell-text']}>{invoice?.phone}</Text>
      </View>
    </View>
  )
  return (
    <Popup visible={cancelOrderVisible} onClose={handleClose}>
      <View className={styles.box}>
        <Text className={styles.title}>
          {intl.formatMessage({ id: 'order.fapiaoxinxi', defaultMessage: '发票信息' })}
        </Text>
      </View>
      {invoice?.invoiceType === INVOICE_KIND.ENTERPRISE ? enterprise() : personal()}
    </Popup>
  )
}

export default Invoice
