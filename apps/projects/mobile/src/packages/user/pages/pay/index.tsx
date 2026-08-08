import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Input, Toast } from '@apps/mobile-ui'
import {
  getCurrentInstance,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  requestPayment,
  login,
  showToast,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { decryptedByAES } from '@linkseeks/crypto'
import { getPayMobileEAccountAllInPayGetRechargeResult, postPayMobileEAccountAllInPayRecharge } from '@apps/apis'
import { postOrderMobileCreateBuyerPay } from '@apps/apis'
import { IS_WEB } from '@/constants'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const Pay = () => {
  const { accessToken, money, type, newOrderMessage }: any = getCurrentInstance()?.router?.params
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'pay.navigationBarTitleText' }) })
    // console.log(JSON.parse(decryptedByAES(newOrderMessage)), '解谜依稀爱爱爱爱爱');
    Confirm()
  }, [])
  const getRechargeResult = async (tradeCode: string): Promise<boolean> => {
    const rechargeResult = await getPayMobileEAccountAllInPayGetRechargeResult({
      tradeCode,
    })
    if (rechargeResult.code === 1000) {
      return rechargeResult.data
    }
    return false
  }
  // console.log(decryptedByAES(sss), '解谜依稀爱爱爱爱爱');
  const fnPaySuccess = (res) => {
    if (res.code === 1000 && res.data) {
      if (res.data.param) {
        const payParam: any = JSON.parse(res.data.param)
        const tradeCode = res.data.tradeCode
        requestPayment({
          nonceStr: payParam?.nonceStr,
          package: payParam?.package,
          paySign: payParam?.paySign,
          timeStamp: payParam?.timeStamp,
          signType: payParam?.signType,
          success: () => {
            showToast({
              title: intl.formatMessage({
                id: 'pay.toast.success',
              }),
              icon: 'none',
            })
            Router.redirectTo('user/paySuccess', {
              tradeCode,
            })
          },
          fail: async () => {
            const rechargeRes = await getRechargeResult(res.data.tradeCode)
            if (rechargeRes) {
              Router.redirectTo('user/paySuccess', {
                tradeCode,
              })
            }
          },
        })
      }
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
        icon: 'none',
      })
    }
    hideLoading()
  }
  /**
   * 支付订单
   */
  let newOrderMessageObj: any = {}
  const fnPayOrder = async () => {
    const weChatCode = IS_WEB ? null : (await login()).code
    try {
      newOrderMessageObj = JSON.parse(decryptedByAES(newOrderMessage))
      const params = {
        ...newOrderMessageObj,
        weChatCode,
      }
      const headers: any = {
        accessToken,
      }
      postOrderMobileCreateBuyerPay(params, {
        headers,
      })
        .then((pendingOrderPayRes) => {
          if (pendingOrderPayRes.code != 1000) {
            Toast.show({
              title: intl.formatMessage({
                id: `${pendingOrderPayRes.code}`,
                defaultMessage: pendingOrderPayRes.message,
              }),
              icon: 'none',
            })
            return
          } else {
            try {
              const wechatPayParams = pendingOrderPayRes.data
              const codeUrl = JSON.parse(wechatPayParams.codeUrl)
              requestPayment({
                timeStamp: codeUrl.timeStamp,
                nonceStr: codeUrl.nonceStr,
                package: codeUrl.package,
                signType: codeUrl.signType,
                paySign: codeUrl.paySign,
                success: function () {
                  showToast({
                    title: intl.formatMessage({
                      id: 'pay.toast.success',
                    }),
                    icon: 'none',
                  })
                  console.log(newOrderMessageObj)
                  hideLoading()
                  Router.redirectTo('user/paySuccess', {
                    tradeCode: newOrderMessageObj.orderIds[0],
                  })
                },
                fail: function (res) {
                  console.log(res)
                  // Toast.show({ title: res, icon: 'none' })
                },
              })
            } catch (erorr) {
              console.error(erorr)
            }
          }
        })
        .catch((err) => {
          hideLoading()
          Toast.show({
            title: err,
            icon: 'none',
          })
        })
    } catch (error) {
      console.log(error)
      // alert(error);
    }
  }
  /**
   * 确认支付
   */
  const Confirm = async () => {
    showLoading({
      title: intl.formatMessage({
        id: 'pay.loading',
      }),
      mask: true,
    })
    if (newOrderMessage) {
      // 订单支付
      fnPayOrder()
      return
    }
    const jsCode = IS_WEB ? undefined : (await login()).code
    const params: any = {
      jsCode,
      money,
      type,
    }
    const headers: any = {
      accessToken,
    }
    postPayMobileEAccountAllInPayRecharge(params, {
      headers,
    })
      .then((res) => {
        fnPaySuccess(res)
      })
      .catch(() => {
        hideLoading()
      })
  }
  // console.log(getCurrentInstance()?.router?.params, '页面的参数啦啦啦');
  return (
    <View className={styles['AccountRecharge']}>
      <View className={styles['AccountRecharge-Container']}>
        <View className={styles['AccountRecharge-title']}>
          {intl.formatMessage({
            id: 'pay.recharge.title',
          })}
        </View>
        <View className={styles['inputContainer']}>
          <Input
            placeholder={intl.formatMessage({
              id: 'pay.recharge.money.placeholder',
            })}
            disabled
            value={money}
            type="digit"
          />
        </View>
      </View>
      <View className={styles['action']}>
        {intl.formatMessage({
          id: 'pay.recharge.confirm.btn',
        })}
      </View>
    </View>
  )
}
export default GlobalWrapper(Pay)
