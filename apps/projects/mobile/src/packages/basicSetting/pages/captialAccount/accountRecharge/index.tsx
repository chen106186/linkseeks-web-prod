import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { View, Input, Toast, Text } from '@apps/mobile-ui'
import { IS_WEB } from '@/constants'
import {
  pxTransform,
  setNavigationBarTitle,
  getCurrentInstance,
  login,
  preload,
  requestPayment,
  showLoading,
  hideLoading,
} from '@apps/mobile-services/utils/taro'
import Overlays from '@/components/Overlay'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import CodeInput from '@/components/CodeInput'
import { SOURCE_TYPE, PAY_TYPE } from '@/constants/const/payResult'
import {
  getPayMobileEAccountAllInPayGetRechargeResult,
  getPayMobileEAccountAllInPayReSendPayCode,
  postPayMobileAssetAccountRechargeApplet,
  postPayMobileEAccountAllInPayConfirmPay,
  postPayMobileEAccountAllInPayRecharge,
  postPayMobileAssetAccountRechargeJsApi,
} from '@apps/apis'
import Capture from '../../accountSafe/components/capture'
import PayType from '../components/PayType'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const WECHAT_PAY = IS_WEB ? PAY_TYPE.WECHATPAY_MINIPROGRAM_ORG : PAY_TYPE.WECHATPAY_MINIPROGRAM_CASHIER_VSP_ORG
const AccountRecharge = () => {
  const [value, setValue] = useState<string>()
  const intl = useIntl()
  const defaultPayTypeList = [
    // {
    //   key: WECHAT_PAY,
    //   value: intl.formatMessage({
    //     id: 'pay.weixinzhifu',
    //     defaultMessage: '微信支付',
    //   }),
    // },
    // {
    //   key: PAY_TYPE.SCAN_ALIPAY,
    //   value: intl.formatMessage({ id: 'pay.alipay', defaultMessage: '支付宝' }),
    // },
    {
      key: PAY_TYPE.QUICKPAY_VSP,
      value: intl.formatMessage({ id: 'pay.kuaijiezhifu', defaultMessage: '快捷支付' }),
    },
  ]
  const {
    params: { memberAssetAccountId, bizUserId, onConfirm },
  }: any = getCurrentInstance().preloadData
  const [showPayType, setShowPayType] = useState<boolean>(false)
  const [payTypeList] = useState<any[]>(defaultPayTypeList)
  const [selectPayTye, setSelectPayType] = useState<string>(PAY_TYPE.QUICKPAY_VSP)
  const [modalVisible, setModalVisible] = useState(false)
  const [tradeCode, setTradeCode] = useState<string>()
  const payState = useRef<boolean>(true)
  const getRechargeResult = async (code: string): Promise<boolean> => {
    const rechargeResult = await getPayMobileEAccountAllInPayGetRechargeResult({
      tradeCode: code,
    })
    if (rechargeResult.code === 1000) {
      return rechargeResult.data
    }
    return false
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'pay.chongzhi', defaultMessage: '充值' }) })
  }, [])
  const allInPayRecharge = async (money: string, type: string) => {
    // H5 e账号微信支付（即通联微信支付）需拉起小程序进行支付
    if (IS_WEB && bizUserId && type === PAY_TYPE.WECHATPAY_MINIPROGRAM_ORG) {
      preload('params', {
        money,
      })
      Router.navigateTo('order/payResult', {
        type: SOURCE_TYPE.BIZ_USER,
        isMiniPay: 1,
        payType: PAY_TYPE.WECHATPAY_MINIPROGRAM_ORG,
      })
      return
    }
    const jsCode = IS_WEB ? undefined : (await login()).code
    const params: any = {
      jsCode,
      money,
      type,
    }
    showLoading({
      title: intl.formatMessage({
        id: 'pay.jiazaizhong',
        defaultMessage: '加载中',
      }),
      mask: true,
    })
    postPayMobileEAccountAllInPayRecharge(params)
      .then((res) => {
        if (res.code === 1000 && res.data) {
          switch (type) {
            case PAY_TYPE.WECHATPAY_MINIPROGRAM_ORG:
              if (res.data.param) {
                const payParam: any = JSON.parse(res.data.param)
                // 微信支付
                requestPayment({
                  nonceStr: payParam?.nonceStr,
                  package: payParam?.package,
                  paySign: payParam?.paySign,
                  timeStamp: payParam?.timeStamp,
                  signType: payParam?.signType,
                  success: () => {
                    if (onConfirm) {
                      onConfirm()
                      Router.navigateBack()
                    }
                  },
                  fail: async (erorr) => {
                    const rechargeRes = await getRechargeResult(res.data.tradeCode)
                    if (rechargeRes) {
                      if (onConfirm) {
                        onConfirm()
                        Router.navigateBack()
                      }
                    }
                  },
                })
              }
              break
            case PAY_TYPE.SCAN_ALIPAY:
              Router.navigateTo('order/payResult', {
                type: bizUserId ? SOURCE_TYPE.BIZ_USER : SOURCE_TYPE.USER,
                tradeCode: res.data.tradeCode,
                url: res.data.param,
                payType: PAY_TYPE.SCAN_ALIPAY,
              })
              break
            case PAY_TYPE.QUICKPAY_VSP:
              setModalVisible(true)
              setTimeout(() => {
                setTradeCode(res.data.tradeCode)
              }, 2000)
              break
            default:
              break
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
        payState.current = false
      })
      .catch(() => {
        hideLoading()
        payState.current = false
      })
  }
  const checkAndShowPayTypeModal = () => {
    if (!value) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshuruchongzhijine',
          defaultMessage: '请输入充值金额',
        }),
        icon: 'none',
      })
      return
    }
    if (Number(value) === 0) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.chongzhijinebunengwei0',
          defaultMessage: '充值金额不能为0',
        }),
        icon: 'none',
      })
      return
    }
    if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshuruzhengquedejine',
          defaultMessage: '请输入正确的金额',
        }),
        icon: 'none',
      })
      return
    }
    if (bizUserId) {
      setShowPayType(true)
    } else {
      Confirm(1)
    }
  }
  const Confirm = async (type) => {
    try {
      if (!payState.current) {
        return
      }
      payState.current = false
      const jsCode = IS_WEB ? undefined : (await login()).code
      const api = IS_WEB ? postPayMobileAssetAccountRechargeJsApi : postPayMobileAssetAccountRechargeApplet
      const money = value
      if (bizUserId && money) {
        allInPayRecharge(money, type)
        return
      }
      const pendingOrderPayRes = await api({
        memberAssetAccountId: Number(memberAssetAccountId),
        money: Number(money),
        type,
        jsCode,
      } as any)
      if (pendingOrderPayRes.code != 1000) {
        Toast.show({
          title: pendingOrderPayRes.message,
          icon: 'none',
        })
        return
      } else {
        if (!IS_WEB) {
          requestPayment({
            nonceStr: pendingOrderPayRes.data.noncestr,
            package: pendingOrderPayRes.data.prepayid,
            paySign: pendingOrderPayRes.data.sign,
            timeStamp: pendingOrderPayRes.data.timestamp,
            signType: pendingOrderPayRes.data.signType,
            success: function (res: any) {
              if (onConfirm) {
                onConfirm()
                Router.navigateBack()
              }
            },
            fail: function (erorr) {
              console.error('取消支付')
            },
          })
        } else {
          Router.navigateTo('order/payResult', {
            type: SOURCE_TYPE.USER,
            tradeCode: pendingOrderPayRes.data.accountTradeRecordId,
            url: pendingOrderPayRes.data.mwebUrl,
            payType: PAY_TYPE.WECHATPAY_H5_OPEN,
          })
        }
      }
      payState.current = true
    } catch (error) {
      payState.current = true
    }
  }

  /**
   * 隐藏支付方式
   */
  const fnClosePayType = () => {
    setShowPayType(!showPayType)
  }

  /**
   * 确定支付方式
   */
  const fnDeterminePayType = (newType: any) => {
    setSelectPayType(newType)
    fnClosePayType()
    Confirm(newType)
  }

  /**
   * 通联支付 - 快捷支付确认支付
   */
  const handleFinish = async (code: string) => {
    if (!code) {
      return
    }
    const param: any = {
      tradeCode,
      verificationCode: code,
    }
    postPayMobileEAccountAllInPayConfirmPay(param)
      .then((res: any) => {
        if (res.code === 1000) {
          if (res.data?.payStatus === 'success') {
            Toast.show({
              title: intl.formatMessage({
                id: 'pay.zhifuchenggong',
                defaultMessage: '支付成功',
              }),
            })
            setModalVisible(false)
            if (onConfirm) {
              onConfirm()
              Router.navigateBack()
            }
          } else if (res.data?.payStatus === 'unpay') {
            Toast.show({
              title: res.data?.payFailMessage,
            })
          } else {
            Toast.show({
              title: res.data?.payFailMessage,
            })
            setModalVisible(false)
          }
        } else {
          Toast.show({
            title: res?.message,
            icon: 'none',
          })
        }
      })
      .catch(() => {
        setModalVisible(false)
      })
  }

  /* 获取验证码 */
  const GetCode = async () => {
    if (tradeCode) {
      await getPayMobileEAccountAllInPayReSendPayCode({
        tradeCode,
      })
    }
  }
  const CodeDom = () => (
    <Capture
      beforeGetCode={() => GetCode()}
      send
      showState={modalVisible}
      render={(count: number) =>
        count === 0 ? (
          <Text className={styles['codeText']}>
            {intl.formatMessage({
              id: 'pay.huoquyanzhengma',
              defaultMessage: '获取验证码',
            })}
          </Text>
        ) : (
          <Text className={styles['codeText']}>{`${count}${intl.formatMessage({
            id: 'pay.shouzaicifasong',
            defaultMessage: 's后再次发送',
          })}`}</Text>
        )
      }
    />
  )
  return (
    <View className={styles['AccountRecharge']}>
      <View className={styles['AccountRecharge-Container']}>
        <View className={styles['AccountRecharge-title']}>
          {intl.formatMessage({
            id: 'pay.chongzhijineyuan',
            defaultMessage: '充值金额(元)',
          })}
        </View>
        <View className={styles['inputContainer']}>
          <Input
            placeholder={intl.formatMessage({
              id: 'pay.qingshuruchongzhijine',
              defaultMessage: '请输入充值金额',
            })}
            value={value}
            onChange={(e: string) => setValue(e)}
            type="digit"
          />
        </View>
      </View>
      <View className={styles['action']} onClick={checkAndShowPayTypeModal}>
        {intl.formatMessage({
          id: 'pay.chongzhi',
          defaultMessage: '充值',
        })}{' '}
      </View>
      <PayType
        payTypeList={payTypeList}
        money={value}
        showPayType={showPayType}
        fnClose={() => {
          fnClosePayType()
        }}
        fnDetermineProps={fnDeterminePayType}
        selectPayType={selectPayTye}
      />
      {/* 更换手机号模态框 */}
      <Overlays visible={modalVisible} position="center">
        <View className={styles['modelWrap']}>
          <View className={styles['modelMmian']}>
            <View className={styles['title']}>
              {intl.formatMessage({
                id: 'pay.yanzhengma',
                defaultMessage: '验证码',
              })}
            </View>
            <View className={styles['modeCard']}>
              <Text
                style={{
                  fontSize: pxTransform(12),
                  color: '#5C626A',
                  marginBottom: pxTransform(24),
                }}
              >
                {intl.formatMessage({
                  id: 'pay.yijiangyanzhengmafasongzhi',
                  defaultMessage: '已将验证码发送至您的手机号',
                })}
              </Text>
              <CodeInput autoFocus onFinish={handleFinish} maxLength={6} />
              <View
                style={{
                  marginTop: pxTransform(12),
                }}
              >
                {CodeDom()}
              </View>
            </View>
          </View>
        </View>
      </Overlays>
    </View>
  )
}
export default GlobalWrapper(AccountRecharge)
