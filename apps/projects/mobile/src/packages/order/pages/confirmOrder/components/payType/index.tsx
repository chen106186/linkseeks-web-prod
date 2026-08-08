import React, { useState, useEffect, useCallback } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Checkbox } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { IS_WEB } from '@/constants'
import { isWeChat } from '@/utils'
import Popup from '@/components/Popup'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import { initPayType } from '../../../../common/commonlyFn'
import styles from './index.module.scss'

const vipScore = getOssUrlPath('/miniprogram/assets/images/vipScore.png')
const platformScore = getOssUrlPath('/miniprogram/assets/images/platformScore.png')
const alipay = getOssUrlPath('/miniprogram/assets/alipay.svg')
const balance = getOssUrlPath('/miniprogram/assets/balance.svg')
const unionPay = getOssUrlPath('/miniprogram/assets/unionPay.svg')
const weChat = getOssUrlPath('/miniprogram/assets/weChat.svg')

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  showPayType: boolean
  fnClose: Function
  fnDetermineProps: Function
  payTypeList: any
  selectPayType?: any
  orderInfo: any
}

const PayType: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { showPayType, fnClose, orderInfo, payTypeList, fnDetermineProps, selectPayType } = props
  const [payTypeListDesc, setPayTypeListDesc] = useState<any>([])
  const [newSelectType, setNewSelectType] = useState<any>({})

  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }
  const fnChangeSelect = (value: number) => {
    setNewSelectType(value)
  }
  /**
   * 获取svg图片路径
   */
  const fnGetSvgUrl = (type: number) => {
    let url = ''
    switch (type) {
      case 2:
        url = weChat
        break
      case 1:
        url = alipay
        break
      case 4:
        url = balance
        break
      case 3:
        url = unionPay
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
    if (payTypeList) {
      const arrDesc = initPayType(payTypeList)
      setPayTypeListDesc([...arrDesc])
    }
  }, [payTypeList])

  useEffect(() => {
    setNewSelectType(selectPayType)
  }, [selectPayType])

  const judgeSupportDelivery = useCallback(
    (payChannel: number) => {
      if (payChannel !== 7) return true
      if (!orderInfo) return false
      const productList: any[] = []
      for (const key of Object.keys(orderInfo)) {
        const item = orderInfo[key]
        if (item && item.length > 0) {
          productList.push(...item)
        }
      }
      if (productList && productList.length > 0) {
        return productList.some((item) => item?.logistics?.deliveryType === 1)
      }
      return true
    },
    [orderInfo],
  )

  return (
    <Popup visible={showPayType} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>
          <Text className={styles['text']}>{intl.formatMessage({ id: 'confirmOrder_components_payType_title' })}</Text>
        </View>
        <View className={styles['content-main']}>
          {payTypeListDesc &&
            payTypeListDesc.map((item: any, index: number) => (
              <View className={styles['content-warp']} key={`payType${index}`}>
                <Text className={styles['second-title']}>{item.payTypeName}</Text>
                {item.payChannels.map((second: any, indexTyoe: number) => {
                  // 微信没有支付宝支付 通联支付的支付宝支付 网银支付
                  if (!IS_WEB || isWeChat()) {
                    if (
                      second.payChannel === 1 ||
                      second.payChannel === 12 ||
                      second.payChannel === 14 ||
                      second.payChannel === 16
                    ) {
                      return
                    }
                  }
                  return (
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'column' }} key={`pay${indexTyoe}`}>
                      <View
                        className={styles['content-item']}
                        onClick={() => {
                          if (judgeSupportDelivery(second.payChannel)) {
                            fnChangeSelect(second)
                          }
                        }}
                      >
                        <View className={styles['content-left']}>
                          {second.payType === 1 && (
                            <Image
                              src={fnGetSvgUrl(second.payChannel)}
                              style={{ width: pxTransform(30), height: pxTransform(30) }}
                              className={styles['content-img']}
                            />
                          )}
                          {second.payType === 10 && (
                            <Image
                              src={second.payChannel === 10 ? platformScore : vipScore}
                              style={{ width: pxTransform(30), height: pxTransform(30) }}
                              className={styles['content-img']}
                            />
                          )}
                          <Text className={styles['name']}>{second.payChannelName}</Text>
                        </View>
                        {judgeSupportDelivery(second.payChannel) ? (
                          <Checkbox
                            checked={newSelectType.payChannel === second.payChannel}
                            onChange={() => {
                              fnChangeSelect(second)
                            }}
                          />
                        ) : (
                          <View className={styles['disabled_checkbox']} />
                        )}
                      </View>
                      <View>
                        {second.payType === 10 && (
                          <Text style={{ fontSize: pxTransform(14) }}>
                            {intl.formatMessage({ id: 'confirmOrder_components_payType_payAll', data: second.payAll })}
                          </Text>
                        )}
                      </View>
                    </View>
                  )
                })}
              </View>
            ))}
        </View>
        <View className={styles['footer-btn-warp']} onClick={fnDetermine}>
          <Text className={styles['footer-btn-text']}>
            {intl.formatMessage({ id: 'confirmOrder_components_payType_footerBtnText' })}
          </Text>
        </View>
      </View>
    </Popup>
  )
}

export default observer(PayType)
