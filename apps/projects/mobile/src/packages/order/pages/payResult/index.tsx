import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Button, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useRouter, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { isWeChat } from '@/utils'
import { SOURCE_TYPE, PAY_TYPE } from '@/constants/const/payResult'
import { IS_WEB, OFFICIAL_ACCOUNT_APPID } from '@/constants'
import { USER_INFO } from '@/constants/storage'
import { decryptedByAES } from '@linkseeks/crypto'
import { setAsyncStorage, getAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import {
  getPayMobileAssetAccountGetRechargeResult,
  getPayMobileEAccountAllInPayGetRechargeResult,
  postPayWeChatMobileGetUrlLink,
} from '@apps/apis'
import { getOrderMobileCreateBuyerPayResult, postOrderMobileCreateBuyerPay } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
type THE_SOURCE_TYPE = SOURCE_TYPE.ORDER | SOURCE_TYPE.BIZ_USER | SOURCE_TYPE.USER
const API_AND_KEY = {
  [SOURCE_TYPE.ORDER]: {
    api: getOrderMobileCreateBuyerPayResult,
    key: 'tradeNo',
  },
  [SOURCE_TYPE.BIZ_USER]: {
    api: getPayMobileEAccountAllInPayGetRechargeResult,
    key: 'tradeCode',
  },
  [SOURCE_TYPE.USER]: {
    api: getPayMobileAssetAccountGetRechargeResult,
    key: 'tradeRecordId',
  },
}
const PayResult = () => {
  /**
   * @param orderId 提交订单时生成的订单ID，这里主要用去前往对应的订单详情
   * @param isMiniPay 提交订单或e账户充值时走通联微信支付的方式时，标识这里需要拉起小程序去支付
   * @param tradeCode 支付单号，主要用于轮询支付结果
   * @param url 普通浏览器的原生微信H5支付和通联支付宝支付的支付链接，跳转即可拉起微信app或支付宝app
   * @param codeUrl 提交订单时原生支付宝支付的表单代码，需要dom触发提交，触发后即可拉起支付宝app
   * @param type 上一个页面跳转过来的类型区分，即提交订单页面 SOURCE_TYPE.ORDER，e账户充值页面 SOURCE_TYPE.BIZ_USER，余额账户充值页面 SOURCE_TYPE.USER
   * @param payType 后端对应的支付类型标识，这里主要用到 PAY_TYPE.WECHATPAY_H5_OPEN 来区分出普通浏览器的原生微信H5支付
   * @param code 微信内静默授权重定向返回的code，微信内部浏览器微信支付走 JSSDK 的支付时需要用到
   */
  const { orderId, isMiniPay, tradeCode, url, codeUrl, type, payType, code, keyTime } = useRouter().params
  const money = getCurrentInstance().preloadData?.params?.money // 金额，通联微信支付带往小程序的金额参数
  const newOrderMessage = getCurrentInstance().preloadData?.params?.newOrderMessage // 通联微信支付带往小程序的订单信息参数或者创建支付订单时相关的订单信息
  const isJsSdkWechatPay = getCurrentInstance().preloadData?.params?.isJsSdkWechatPay // 判断是否为微信内微信H5支付的标识(这里使用js-sdk提供的支付方式)

  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const intervalRef = useRef<any>(null)
  const intervalTimeRef = useRef<number>(0)
  const intl = useIntl()

  // 禁用支付分享, 防止订单未生成而进入该页面导致的报错
  const hideWxMenus = () => {
    const menuList = ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:copyUrl']
    wx.hideMenuItems({
      menuList, // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
    })
  }

  // 创建微信内H5支付
  const createWxPay = () => {
    if (keyTime && code) {
      const orderMessage = getAsyncStorage('PAY_ORDER_MESSAGE')?.[keyTime]
      console.log('orderMessage :>> ', orderMessage)
      const theOrderMessage = JSON.parse(decryptedByAES(orderMessage))
      console.log('theOrderMessage :>> ', theOrderMessage)
      postOrderMobileCreateBuyerPay({
        ...theOrderMessage,
        // 订单信息
        weChatCode: code,
        // code
        wechatBrowser: 1, // 标识本次为微信内H5支付
      }).then(({ code: resCode, data }) => {
        console.log('CreateBuyerPay data', data)
        if (resCode === 1000) {
          const weChatPayParams = JSON.parse(data.codeUrl)
          wx.chooseWXPay({
            timestamp: weChatPayParams.timeStamp,
            // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: weChatPayParams.nonceStr,
            // 支付签名随机串，不长于 32 位
            package: weChatPayParams.packageValue ?? weChatPayParams.package,
            // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*） 该参数需要openid
            signType: weChatPayParams.signType,
            // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: weChatPayParams.paySign,
            // 支付签名 参与签名的参数为：appId、timeStamp、nonceStr、package、signType
            success: () => {
              console.log('success')
              removeAsyncStorage('PAY_ORDER_MESSAGE')
              goDetail()
            },
            // 成功处理
            fail: () => {
              console.log('fail')
              goDetail()
            },
            // 失败处理
            cancel: () => {
              console.log('cancel')
              goDetail()
            }, // 取消处理
            // complete({ errMsg }) {
            //   const SUCCESS = /:ok/gi.test(errMsg);
            //   const CANCEL = /:cancel/gi.test(errMsg);
            //   if (SUCCESS) this.queryPayment();
            //   else if (CANCEL) this.showRefail();
            //   else this.showFail();
            // } // 公共查询结果接口
          })
        }
      })
    }
  }
  const getPayResult = async () => {
    const reqApi = API_AND_KEY[type as THE_SOURCE_TYPE].api
    const res = await reqApi({
      [API_AND_KEY[type as THE_SOURCE_TYPE].key]: tradeCode,
    } as any)
    if (res.code === 1000) {
      return res.data
    }
    return false
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'pay.pay', defaultMessage: '支付' }) })
  }, [])
  useEffect(() => {
    // 通联微信支付情况下，当页面刷新导致 money 数据丢失，则离开当前页面
    if (isMiniPay && !money) {
      goDetail()
      return
    }
    // 若为微信内微信H5支付，则前往静默授权获取code
    if (isJsSdkWechatPay && newOrderMessage && isWeChat()) {
      // 获取当前时间戳作为KEY
      const messageKeyTime = new Date().getTime()
      // 保存订单信息，授权回调后通过keyTime重新获取
      setAsyncStorage('PAY_ORDER_MESSAGE', {
        [messageKeyTime]: newOrderMessage,
      })
      const redirect_uri = `${encodeURIComponent(window.location.href + `&keyTime=${messageKeyTime}`)}`
      console.log('redirect_uri', redirect_uri)
      const oauth2_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${OFFICIAL_ACCOUNT_APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&connect_redirect=1&state=xxxx#wechat_redirect`
      console.log('oauth2_url', oauth2_url)
      // window.location.replace(oauth2_url)
      window.location.href = oauth2_url
      return
    }
    // 轮询支付结果
    if (tradeCode) {
      const fnInterval = () => {
        intervalRef.current = setInterval(async () => {
          if (await getPayResult()) {
            setIsSuccess(true)
            Toast.show({
              title: intl.formatMessage({
                id: 'pay.paid',
                defaultMessage: '支付成功',
              }),
              icon: 'none',
            })
            clearInterval(intervalRef.current)
            goDetail()
            return
          }
          intervalTimeRef.current++
          if (intervalTimeRef.current >= 20) {
            clearInterval(intervalRef.current)
            Router.navigateBack()
          }
        }, 2000)
      }
      fnInterval()
    }
    return () => clearInterval(intervalRef.current)
  }, [])
  const goDetail = () => {
    switch (type) {
      case SOURCE_TYPE.BIZ_USER:
        if (IS_WEB) {
          Router.redirectTo('basicSetting/accountDetail')
        } else {
          Router.navigateBack({
            delta: 2,
          })
        }
        break
      case SOURCE_TYPE.USER:
        if (IS_WEB) {
          Router.redirectTo('basicSetting/accountDetail')
        } else {
          Router.navigateBack({
            delta: 2,
          })
        }
        break
      case SOURCE_TYPE.ORDER:
        Router.redirectTo('order/mycommodityDetails', {
          orderId,
        })
        break
    }
  }
  const goPay = async () => {
    const token = (await getAsyncStorage(USER_INFO)).accessToken
    if (url) {
      // 直接跳转支付链接（目前是普通浏览器的原生微信H5支付和通联支付宝支付会走这里）
      // 微信H5支付设置当前路径为重定向地址
      const redirect_url =
        payType === PAY_TYPE.WECHATPAY_H5_OPEN ? `&redirect_url=${encodeURIComponent(window.location.href)}` : ''
      window.location.href = decodeURIComponent(url) + redirect_url
    } else if (codeUrl) {
      // 支付宝 form 表单形式触发点击后跳转支付链接（目前是创建订单时原生支付宝支付会走这里）
      const dom = [...document.getElementsByTagName('input')].find((item) => item.defaultValue === '立即支付')
      dom?.click()
    } else if (isMiniPay) {
      // 微信内/外浏览器打开小程序（目前是 H5 通联的微信支付会走这里）
      // 微信内/外浏览器打开小程序，通过 urllink 的方式 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/url-link/urllink.generate.html
      // 前提条件：拉起的小程序需发布正式版
      // 在前提条件满足的情况下，1. 在微信内打开时，小程序必须为正式版 2.在微信外打开时，ios可以支持打开体验版和开发版（官方说安卓会在近期支持，我信你个鬼）
      // env_version （'release' | 'trial' | 'develop'）参数可以配置要打开的小程序版本，当热是要在满足上面的条件下
      const params = {
        path: '/pages/pay/index',
        query:
          type === SOURCE_TYPE.ORDER
            ? `newOrderMessage=${newOrderMessage}&token=${token}&money=${money}`
            : `money=${money}&token=${token}&type=${payType}`,
        env_version: 'release', // release | trial | develop
      }
      // 请求得到 urllink 从而跳转小程序
      postPayWeChatMobileGetUrlLink(params).then(({ code: resCode, data, message }) => {
        if (resCode === 1000) {
          window.location.href = data
        } else {
          Toast.show({
            title: message,
            icon: 'none',
          })
        }
      })
    } else if (code && keyTime && isWeChat()) {
      // 微信内 H5 支付（目前是 H5 微信浏览器内部的微信支付会走这里）
      console.log('wx.ready code', code)
      wx.ready(
        () => {
          hideWxMenus()
          createWxPay()
        },
        (err) => {
          console.log('err', err)
        },
      )
    }
  }
  return (
    <View className={styles['viewHeader']}>
      <View className={styles['msg']}>
        {isSuccess
          ? intl.formatMessage({
              id: 'pay.paid',
              defaultMessage: '支付已完成',
            })
          : `${intl.formatMessage({
              id: 'pay.process',
              defaultMessage: '处理中',
            })}...`}
      </View>
      {codeUrl && (
        <View
          dangerouslySetInnerHTML={{
            __html: decodeURIComponent(codeUrl),
          }}
        ></View>
      )}
      <View className={styles['actions']}>
        <Button className={styles['btn']} onClick={goDetail}>
          <Text className={styles['btnText']}>
            {type === SOURCE_TYPE.ORDER
              ? intl.formatMessage({
                  id: 'pay.backToOrder',
                  defaultMessage: '返回订单',
                })
              : `${intl.formatMessage({
                  id: 'pay.backToDetail',
                  defaultMessage: '返回详情',
                })}`}
          </Text>
        </Button>
        <Button className={styles['btn']} onClick={goPay}>
          <Text className={styles['btnText']}>
            {intl.formatMessage({
              id: 'pay.goPay',
              defaultMessage: '前往付款',
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(observer(PayResult))
