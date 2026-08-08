import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: Crayon
 * @Date: 2021-11-02 11:34:27
 * @LastEditTime: 2021-11-16 10:30:00
 * @LastEditors: Crayon
 * @Description: 余额支付和授信支付
 * @FilePath: \lingxi-mobile\src\packages\order\pages\payOrder\index.tsx
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, Toast, ScrollView, Modal } from '@apps/mobile-ui'
import { getMemberMobileSecurityGet, getPayCreditGetCredit, GetPayCreditGetCreditResponse } from '@apps/apis'
import { getPayCreditApplyGetCreditDetail, getPayMobileAssetAccountBalance } from '@apps/apis'
import { postOrderMobileCreateBuyerPay } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { useStores } from '@/store/useStores'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  useRouter,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  pxTransform,
} from '@apps/mobile-services/utils/taro'
import TopTitle from '@/components/TopTitle'
import { useSafeArea } from '@apps/mobile-services'
import PayCount from './components/PayCount'
import PayInputPopup from './components/PayInputPopup'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PayOrder: React.FC = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const {
    params: { storeId },
  } = useRouter()
  const {
    userStore: { userInfo },
    confirmOrderStore: { orderMessage },
  } = useStores()
  const [useBalance, setUseBalance] = useState<any>({})
  const [creditDetail, setCreditDetail] = useState<GetPayCreditGetCreditResponse>()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [toggle, setToggle] = useState(false) // 控制显示弹出

  const isNormalRef = useRef<boolean>(false)
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'payOrder_navigationBarTitleText' }) })
  }, [])
  const isSetPayCodeFn = useCallback(async () => {
    const res = await getMemberMobileSecurityGet()
    if (res.code !== 1000) {
      Toast.show({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
        icon: 'none',
      })
    }
    return res
  }, [])

  /**
   * 确定支付
   */
  const handleShowPopup = async () => {
    if (!isNormalRef.current) {
      Toast.show({
        title: intl.formatMessage({
          id: 'payOrder_handleShowPopup_show_title',
        }),
        icon: 'loading',
      })
      return
    }
    const isSetPayCode = await isSetPayCodeFn()
    if (isSetPayCode.code !== 1000 || !isSetPayCode.data.hasPayPassword) {
      setToggle(true)
      return
    }
    setVisible(true)
  }

  /**
   * 获取账号余额
   */
  const fnGetUserBalance = () => {
    const params = {
      fundMode: orderMessage.fundMode,
      vendorMemberId: orderMessage.vendorMemberId,
      vendorRoleId: orderMessage.vendorRoleId,
    }
    getPayMobileAssetAccountBalance(params).then((res: any) => {
      if (res.code === 1000) {
        isNormalRef.current = true
        setUseBalance({
          momey: res.data,
        })
      } else {
        setUseBalance('')
      }
    })
  }

  /**
   * 获取授信额度
   */
  const fngetCreditDetail = () => {
    const params = {
      parentMemberId: orderMessage.vendorMemberId,
      parentMemberRoleId: orderMessage.vendorRoleId,
    }
    getPayCreditGetCredit(params).then((res: any) => {
      if (res.code === 1000) {
        isNormalRef.current = true
        setCreditDetail(res.data)
      }
    })
  }

  /**
   * 支付取消
   */
  const handleClose = () => {
    setVisible(false)
  }

  /**
   * 支付确认
   */
  const handleCodeFinish = async (payPassword: string) => {
    isNormalRef.current = false
    showLoading({
      title: intl.formatMessage({
        id: 'payOrder_handleCodeFinish_showLoading_title',
      }),
    })
    const { data, code, message } = await postOrderMobileCreateBuyerPay({
      orderIds: orderMessage.orderIds,
      payType: orderMessage.payType,
      payChannel: orderMessage.payChannel,
      batchNo: orderMessage.batchNo,
      fundMode: orderMessage.fundMode,
      payPassword: encryptedByAES(payPassword),
    })
    isNormalRef.current = true
    hideLoading()
    if (code === 1000) {
      Router.redirectTo('order/SubmitSuccess', {
        storeId,
        orderId: orderMessage.orderIds[0],
      })
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${code}`,
          defaultMessage: message,
        }),
        icon: 'none',
      })
      setVisible(false)
    }
  }
  useEffect(() => {
    if (orderMessage.payChannel === 6) {
      fngetCreditDetail()
    } else if (orderMessage.payChannel === 4) {
      fnGetUserBalance()
    }
  }, [orderMessage])
  /**
   * 重置路由，返回的时候跳到待支付页面，将当前页面从路由栈中去除
   */
  const handleGoBack = () => {
    Router.redirectTo('order/mycommodityDetails', {
      orderId: orderMessage.orderIds[0],
      categoryIndex: 0,
    })
  }
  return (
    <View className={styles['page']}>
      <TopTitle
        title={intl.formatMessage({
          id: 'payOrder_title',
        })}
        goBack={handleGoBack}
      />
      <ScrollView
        className={styles['scrollView']}
        contentContainerStyle={{
          width: '100%',
        }}
      >
        <View className={styles['countContainer']} />
        <View className={styles['panel']}>
          <PayCount money={orderMessage.payAmount as number} />
        </View>
        {!loading ? (
          <View className={styles['contentMain']}>
            {orderMessage.payChannel === 6 && (
              <View className={styles['textMain']}>
                <View className={styles['textWarp']}>
                  <Text className={styles['textTitle']}>
                    {intl.formatMessage({
                      id: 'payOrder_textTitle_1',
                    })}
                  </Text>
                  <Text className={styles['textValue']}>
                    {intl.formatMessage({
                      id: 'currency',
                    })}
                    {`${creditDetail?.quota || 0}`}
                  </Text>
                </View>
                <View className={styles['textWarp']}>
                  <Text className={styles['textTitle']}>
                    {intl.formatMessage({
                      id: 'payOrder_textTitle_2',
                    })}
                  </Text>
                  <Text className={styles['textValue']}>
                    {intl.formatMessage({
                      id: 'currency',
                    })}
                    {`${creditDetail?.useQuota || 0}`}
                  </Text>
                </View>
                <View className={styles['textWarp']}>
                  <Text className={styles['textTitle']}>
                    {intl.formatMessage({
                      id: 'payOrder_textTitle_3',
                    })}
                  </Text>
                  <Text className={styles['textValue']}>
                    {intl.formatMessage({
                      id: 'currency',
                    })}
                    {`${creditDetail?.canUseQuota || 0}`}
                  </Text>
                </View>
              </View>
            )}
            {orderMessage.payChannel === 4 && (
              <View className={styles['textMain']}>
                <View className={styles['textWarp']}>
                  <Text className={styles['textTitle']}>
                    {intl.formatMessage({
                      id: 'payOrder_textTitle_4',
                    })}
                  </Text>
                  <Text className={styles['textValue']}>
                    {intl.formatMessage({
                      id: 'currency',
                    })}
                    {`${useBalance.momey || 0}`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View>
            {intl.formatMessage({
              id: 'payOrder_loading',
            })}
          </View>
        )}
      </ScrollView>
      <View
        className={styles['btn-container']}
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(8),
        }}
      >
        <View className={styles['btn']} onClick={handleShowPopup}>
          <Text className={styles['btnText']}>
            {intl.formatMessage({
              id: 'payOrder_btnText',
            })}
          </Text>
        </View>
      </View>
      <PayInputPopup
        isError={false}
        visible={visible}
        loading={loading}
        onCancel={handleClose}
        total={orderMessage.payAmount}
        onCodeFinish={handleCodeFinish}
        title={
          orderMessage.payChannel === 6
            ? intl.formatMessage({
                id: 'consts.product.PAY_WAY_CREDIT',
                defaultMessage: '授信额度支付',
              })
            : intl.formatMessage({
                id: 'payOrder_components_payInputPopup_title',
                defaultMessage: '余额支付',
              })
        }
        currency={intl.formatMessage({
          id: 'currency',
        })}
      />
      <Modal
        isOpened={toggle}
        onConfirm={() => {
          setToggle(false)
          Router.navigateTo('basicSetting/phone', {
            type: 'paycode',
          })
        }}
        onCancel={() => setToggle(false)}
        content={intl.formatMessage({
          id: 'payOrder_handleShowPopup_showModal_content',
        })}
        confirmText={intl.formatMessage({
          id: 'payOrder_handleShowPopup_showModal_confirmText',
        })}
        className={styles['payOrder-model']}
      />
    </View>
  )
}
export default GlobalWrapper(PayOrder)
