import React, { useState, useEffect } from 'react'
import { View, Text, Image, Checkbox } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Popup from '@/components/Popup'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const balance = getOssUrlPath('/miniprogram/assets/balance.svg')
const weChat = getOssUrlPath('/miniprogram/assets/weChat.svg')

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  showPayType: boolean
  fnClose: Function
  fnDetermineProps: Function
  money?: string
  payTypeList: {
    key: string
    value: string
  }[]
  selectPayType?: any
}

const PayType: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { showPayType, fnClose, selectPayType, payTypeList, money, fnDetermineProps } = props
  const [newSelectType, setNewSelectType] = useState<any>(selectPayType)
  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }
  const fnChangeSelect = (value: string) => {
    console.log(value)
    setNewSelectType(value)
  }
  /**
   * 获取svg图片路径
   */
  const fnGetSvgUrl = (type: string) => {
    let url = ''
    switch (type) {
      case 'WECHATPAY_MINIPROGRAM_ORG':
        url = weChat
        break
      case 'QUICKPAY_VSP':
        url = balance
        break
      default:
        url = weChat
        break
    }
    return url
  }
  /**
   * 确定修改支付方式
   */
  const fnDetermine = () => {
    fnDetermineProps(newSelectType)
  }

  useEffect(() => {
    console.log(payTypeList, 'payTypeList')
  }, [payTypeList])

  return (
    <Popup visible={showPayType} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>
          <Text className={styles['text']}>
            {intl.formatMessage({ id: 'pay.xuanzechongzhifangshi', defaultMessage: '选择充值方式' })}
          </Text>
        </View>
        <View className={styles['content-main']}>
          <View className={styles.modalViewDetail}>
            <Text className={styles.modalViewDetailText}>
              {' '}
              {intl.formatMessage({ id: 'pay.chongzhijineyuan', defaultMessage: ' 充值金额(元)' })}
            </Text>
            <Text className={styles.modalViewDetailAmount}>
              <Text style={{ fontSize: '24px' }}>{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}</Text>
              {money || 0}
            </Text>
          </View>
          {payTypeList &&
            payTypeList.map((item, index) => (
              <View style={{ width: '100%', display: 'flex', flexDirection: 'column' }} key={`pay${index}`}>
                <View className={styles['content-item']}>
                  <View className={styles['content-left']}>
                    <Image className={styles['content-img']} src={fnGetSvgUrl(item.key)} />
                    <Text className={styles.name}>{item.value}</Text>
                  </View>
                  <Checkbox
                    checked={newSelectType === item.key}
                    onChange={() => {
                      fnChangeSelect(item.key)
                    }}
                  />
                </View>
              </View>
            ))}
        </View>
        <View className={styles['footer-btn-warp']} onClick={fnDetermine}>
          <Text className={styles['footer-btn-text']}>
            {intl.formatMessage({ id: 'pay.queding', defaultMessage: '确定' })}
          </Text>
        </View>
      </View>
    </Popup>
  )
}

export default observer(PayType)
