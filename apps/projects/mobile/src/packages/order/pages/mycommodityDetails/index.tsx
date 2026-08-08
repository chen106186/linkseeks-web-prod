import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import {
  pxTransform,
  getCurrentInstance,
  useShareAppMessage,
  preload,
  showLoading,
  hideLoading,
  login,
  requestPayment,
} from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import { SOURCE_TYPE, PAY_TYPE } from '@/constants/const/payResult'
import { View, Text, Icons, Toast, Image } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { getOssUrlPath } from '@apps/constants'
import Overlays from '@/components/Overlay'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { isWeChat } from '@/utils'
import { getMemberMobileLrcRightPointGet } from '@apps/apis'
import {
  getOrderMobileBuyerDetail,
  getOrderMobileBuyerValidatePayType,
  getOrderMobileCreateFindDeliveryDate,
  postOrderCreateBuyerPay,
  postOrderMobileBuyerUpdateDeliveryTime,
  postOrderMobileCreateBuyerPay,
} from '@apps/apis'
import { postMarketingMobileActivityOrderGroupPurchaseDetail } from '@apps/apis'
import { postPayEAccountAllInPayConfirmPay } from '@apps/apis'
import PayType from '@/components/PayType'
import Header from '@/components/NavBar'
import useStores from '@/store/useStores'
import CodeInput from '@/components/CodeInput'
import styles from './index.module.scss'

/* 待审核样式 */
// import Examine from './components/Examine'
/* 待提交 */
import StaySubmit from '../../components/mycommodityDetails/StaySubmit'
/* 待确认收货 */
import Receiving from '../../components/mycommodityDetails/Receiving'
/* 底部按钮 */
import Foot from '../../components/mycommodityDetails/Foot'
import Invoice from '../../components/mycommodityDetails/Invoice'
import { encryptedByAES } from '@linkseeks/crypto'
import DeliveryTime from '../confirmOrder/components/deliveryTime'
import PayPopupInput from '../integral/components/PaypopupInput'

/*
outerStatusName 头部名称状态
showCancel 取消订单
showAfterSales 申请售后
*/
const MyCommodityDetails = () => {
  const {
    orderId = 3602,
    categoryIndex,
    showCancel,
    showSubmit,
    showAfterSales,
    noBtn,
    noBtnClick,
  }: any = getCurrentInstance()?.router?.params
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleTime, setVisibleTime] = useState<boolean>(false)
  const [randTimeData, setRandTimeData] = useState<any>({})
  const fundModeRef = useRef<any>({})
  const [headText, setHeadText] = useState<boolean>(false)
  const [detailData, setDetailData] = useState<any>()
  const [sendInfo, setSendInfo] = useState<any>({})
  const [payTypeMessage, setPayTypeMessage] = useState<any>({}) // 支付方式
  const [showPayType, setShowPayType] = useState<boolean>(false)
  const [visiblePay, setVisiblePay] = useState<boolean>(false)
  const [innerStatus, setInnerStatus] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<string>('')
  const [payments, setPayments] = useState<any>()
  const [PayMessageCode, setPayMessageCode] = useState<any>({})
  const [modalVisible, setModalVisible] = useState(false)
  const [payMessageType, setPayMessageType] = useState<any>({})
  const [countdown, setCountdown] = useState<any>({})
  const {
    confirmOrderStore: { setOrderMessage },
  } = useStores()
  const intl = useIntl()
  const {
    userStore: { shopAndSite },
  } = useStores()
  /* 头部标题 */
  const Scroll = (evt: any) => {
    const { currentTarget } = evt
    if (currentTarget.scrollTop > currentTarget.offsetTop) {
      setHeadText(true)
    } else {
      setHeadText(false)
    }
  }
  /**
   * 隐藏支付方式
   */
  const fnShowTime = () => {
    setVisibleTime(true)
  }
  const fnShowPayType = () => {
    setShowPayType(true)
  }
  const fnClosePayType = () => {
    setShowPayType(!showPayType)
  }
  const handleClosePay = (id?: number) => {
    setVisiblePay(false)
  }

  /* 关闭时间 */
  const handleTimeClose = () => {
    setVisibleTime(false)
  }
  /* 关闭发票 */
  const handleClose = (flag: boolean) => {
    setVisible(flag)
  }
  /* 确定取消订单 */
  const handleConfirm = () => {}
  /* 点击发票回调 */
  const playInvoice = (flag: any) => {
    setVisible(flag)
  }
  /**
   * 获取支付方式
   */
  // eslint-disable-next-line no-shadow
  const fnGetAllType = async (item: any) => {
    if (item.orderMode === 10 || item.orderMode === 11) {
      const { code, data } = await getMemberMobileLrcRightPointGet({
        memberId: item.vendorMemberId,
        roleId: item.vendorRoleId,
      })
      if (code === 1000) {
        setPayTypeMessage({
          orderIds: [item.orderId],
          payTypes: [
            {
              payAll: data.platformScore,
              payFunMode: 1,
              payChannel: 10,
              payChannelName: intl.formatMessage({
                id: 'order.pingtaitongyongjifen',
                defaultMessage: '平台通用积分',
              }),
              payType: 10,
              payTypeName: intl.formatMessage({
                id: 'order.jifenzhifu',
                defaultMessage: '积分支付',
              }),
            },
            {
              payAll: data.memberScore,
              payFunMode: 2,
              payChannel: 11,
              payChannelName: intl.formatMessage({
                id: 'order.huiyuanzhuanshujifen',
                defaultMessage: '会员专属积分',
              }),
              payType: 10,
              payTypeName: intl.formatMessage({
                id: 'order.jifenzhifu',
                defaultMessage: '积分支付',
              }),
            },
          ],
        })
      }
      return
    }
    const { code, data } = await getOrderMobileBuyerValidatePayType({
      orderId: item.orderId,
    })
    if (code === 1000) {
      setPayTypeMessage({
        orderIds: [item.orderId],
        payTypes: data,
      })
    }
  }

  /**
   * 微信支付
   * @param newPayInfo
   */
  const fnWeChatPay = async (newPayInfo: any) => {
    // H5 通联微信支付 需拉起小程序进行支付
    if (IS_WEB && newPayInfo.payChannel === 11) {
      preload('params', {
        money: newPayInfo.payAmount,
        newOrderMessage: encryptedByAES(JSON.stringify(newPayInfo)),
      })
      Router.navigateTo('order/payResult', {
        type: SOURCE_TYPE.ORDER,
        isMiniPay: 1,
        payType: PAY_TYPE.WECHATPAY_MINIPROGRAM_ORG,
      })
      return
    }
    // 判断环境是否为H5且为微信浏览器
    const weChatBrowser = IS_WEB && isWeChat() ? 1 : 0
    if (weChatBrowser) {
      // 这里H5微信浏览器走该逻辑
      // 微信内 H5 支付需要静默授权获取code
      preload('params', {
        isJsSdkWechatPay: true,
        newOrderMessage: encryptedByAES(JSON.stringify(newPayInfo)),
      })
      Router.navigateTo('order/payResult', {
        type: SOURCE_TYPE.ORDER,
        orderId: newPayInfo.orderIds[0],
      })
      return
    }
    const pendingOrderPayRes = await postOrderMobileCreateBuyerPay({
      ...newPayInfo,
    })
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
      const weChatPayParams = pendingOrderPayRes.data
      const codeUrl = JSON.parse(weChatPayParams.codeUrl)
      requestPayment({
        timeStamp: codeUrl.timeStamp,
        nonceStr: codeUrl.nonceStr,
        package: codeUrl.package,
        signType: codeUrl.signType,
        paySign: codeUrl.paySign,
        success: function () {
          Router.navigateBack()
        },
        fail: function () {},
      })
    }
  }
  /**
   * 发送验证码
   */
  const fnSpendCode = async (newPayInfo: any) => {
    Toast.show({
      title: intl.formatMessage({
        id: 'order.chuangjiandingdanchenggongzheng',
        defaultMessage: '创建订单成功，正在获取验证码',
      }),
      icon: 'none',
    })
    const { data, code, message } = await postOrderMobileCreateBuyerPay({
      orderIds: newPayInfo.orderIds,
      payType: newPayInfo.payType,
      payChannel: newPayInfo.payChannel,
      batchNo: newPayInfo.batchNo,
      fundMode: newPayInfo.fundMode,
    })
    hideLoading()
    if (code === 1000) {
      setPayMessageCode(data)
      setModalVisible(true)
      Toast.show({
        title: intl.formatMessage({
          id: 'order.fasongyanzhengmachenggong',
          defaultMessage: '发送验证码成功',
        }),
        icon: 'none',
      })
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${code}`,
          defaultMessage: message,
        }),
        icon: 'none',
      })
    }
  }

  /**
   * 支付宝支付/通联-支付宝支付
   */
  const onConfirmToAliPay = async (newOrderMessage: any) => {
    const res = await postOrderMobileCreateBuyerPay({
      ...newOrderMessage,
    })
    const URL_KEY = newOrderMessage.payChannel === 12 ? 'url' : 'codeUrl'
    Router.navigateTo('order/payResult', {
      type: SOURCE_TYPE.ORDER,
      tradeCode: res.data.tradeNo,
      orderId: newOrderMessage.orderIds[0],
      storeId: newOrderMessage.storeId,
      [URL_KEY]: res.data.codeUrl,
      payType: PAY_TYPE.SCAN_ALIPAY,
    })
  }

  /**
   * 发送验证码
   */
  const fnDirectPay = async (newPayInfo: any) => {
    showLoading()
    const { data, code, message } = await postOrderMobileCreateBuyerPay({
      orderIds: newPayInfo.orderIds,
      payType: newPayInfo.payType,
      payChannel: newPayInfo.payChannel,
      batchNo: newPayInfo.batchNo,
      fundMode: newPayInfo.fundMode,
    })
    hideLoading()
    if (code === 1000) {
      if (newPayInfo.payChannel === 17) {
        Router.redirectTo('extra/webview', {
          webUrl: data.codeUrl,
          orderId: newPayInfo.orderIds[0],
          tradeNo: data.tradeNo,
        })
        return
      }
      Router.redirectTo('order/SubmitSuccess', {
        orderId: newPayInfo.orderIds[0],
        storeId: newPayInfo.storeId,
      })
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${code}`,
          defaultMessage: message,
        }),
        icon: 'none',
      })
    }
  }

  /**
   * 确定支付方式
   */
  const fnDeterminePayType = async (newType: any) => {
    // await getCode()
    const weChatCode = IS_WEB ? null : (await login()).code
    fnClosePayType()
    setPayMessageType(newType)
    if (detailData.orderMode === 10 || detailData.orderMode === 11) {
      fundModeRef.current = newType
      setVisiblePay(true)
      return
    }
    const newPayInfo = {
      ...newType,
      vendorMemberId: detailData?.vendorMemberId,
      vendorRoleId: detailData?.vendorRoleId,
      payAmount: Number(totalAmount),
      orderIds: [detailData?.orderId],
      batchNo: payments?.batchNo,
      // fundMode: payments?.fundMode, // 不注释会导致改不了订单支付的类型
      weChatCode,
    }
    if (newType.payChannel === 2) {
      // 微信支付
      fnWeChatPay(newPayInfo)
    } else if (newType.payChannel === 1) {
      // 支付宝
      if (IS_WEB) {
        onConfirmToAliPay(newPayInfo)
      }
    } else {
      const routeData = {
        memberId: detailData.vendorMemberId,
        memberRoleId: detailData.vendorRoleId,
      }
      setOrderMessage(newPayInfo)
      if (newType.payChannel === 11) {
        // 通联支付-微信支付
        // onConfirm(newOrderMessage, otherObj);
        fnWeChatPay(newPayInfo)
      } else if (newType.payChannel === 12) {
        // 通联支付-支付宝
        onConfirmToAliPay(newPayInfo)
      } else if (newType.payChannel === 13) {
        // 通联支付-快捷支付
        fnSpendCode(newPayInfo)
      } else if (newType.payChannel === 15) {
        // 通联支付-余额支付
        fnSpendCode(newPayInfo)
      } else if (newType.payChannel === 5) {
        // 线下支付确认
        Router.navigateTo('order/offlineTransfer', {
          orderId: detailData.orderId,
        })
      } else if (
        newType.payChannel === 9 ||
        newType.payChannel === 8 ||
        newType.payChannel === 17 ||
        newType.payChannel === 7
      ) {
        // 结算支付
        fnDirectPay(newPayInfo)
      } else if (newType.payChannel === 18) {
        // 跨境支付
        fnDirectPay(newPayInfo)
      } else {
        Router.navigateTo('order/payOrder', routeData)
      }
    }
  }
  /**
   *0输入验证码
   * @param val 验证码
   */
  const handleFinish = async (val: string) => {
    showLoading({
      title: intl.formatMessage({
        id: 'order.zhifuzhong',
        defaultMessage: '支付中',
      }),
    })
    const { data, code, message } = await postPayEAccountAllInPayConfirmPay({
      tradeCode: PayMessageCode.tradeNo,
      // 订单号
      verificationCode: val, // 短信验证码
    })
    hideLoading()
    if (code === 1000) {
      Toast.show({
        title: intl.formatMessage({
          id: 'order.zhifuchenggong',
          defaultMessage: '支付成功',
        }),
        icon: 'none',
      })
      Router.navigateBack()
    } else {
      Toast.show({
        title: message,
        icon: 'none',
      })
    }
  }
  const fnCloseCode = () => {
    Router.navigateBack()
    setModalVisible(false)
  }

  // 查询拼团信息
  const getPurchase = async (groupId: number) => {
    const res = await postMarketingMobileActivityOrderGroupPurchaseDetail({
      id: groupId,
    })
    if (res.code === 1000) {
      setCountdown(res.data)
    }
  }
  /*  */
  useEffect(() => {
    getDetailInfo()
  }, [])
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: `${intl.formatMessage({
          id: 'order.yuanjia',
          defaultMessage: '原价：',
        })}${detailData?.products[0].price} ${countdown?.assembleNum}${intl.formatMessage({
          id: 'order.rentuanzhixu',
          defaultMessage: '人团 只需',
        })}${detailData?.products[0].refPrice}${intl.formatMessage({
          id: 'order.yuan',
          defaultMessage: '元',
        })}`,
        path: `/packages/commodityMerge/pages/stocksSourcing/shareGroupDetail/index?teamId=${detailData?.groupId}&shopId=${detailData?.shopId}&shopType=${detailData?.shopType}&commodityId=${detailData.products[0].productId}&shopProperty=${shopAndSite?.property}&isSelf=${shopAndSite?.self}&skuId=${detailData.products[0].skuId}`,
        imageUrl: `${detailData.products[0]?.logo}`,
      }
    }
    return {}
  })
  /* 获取数据 */
  const getDetailInfo = () => {
    try {
      getOrderMobileBuyerDetail({
        orderId,
      }).then((res: { code: number; data: any }) => {
        if (res.code === 1000) {
          if (res.data?.groupId > 0 || res.data?.promotionStatus === 1 || res.data?.promotionStatus === 2) {
            getPurchase(res.data.groupId)
          }
          if (res.data.outerStatus === 11 && res.data.deliveries.length > 0) {
            setSendInfo({
              ...sendInfo,
              batchNo: res.data.deliveries[0].batchNo,
              showReceive: res.data.deliveries[0].showReceive,
              outerStatusName: res.data.deliveries[0].innerStatusName,
              outerStatus: 13,
              cbgReceive: !!res.data.pickupPointName,
            })
          } else {
            setSendInfo({
              ...sendInfo,
              batchNo: res.data.deliveries[0]?.batchNo,
              showReceive:
                (res.data.outerStatus === 13 && res.data.pickupPointName) || res.data.deliveries[0]?.showReceive,
              outerStatusName: res.data.outerStatusName,
              outerStatus: res.data.outerStatus,
              cbgReceive: !!res.data.pickupPointName,
            })
          }
          const datas = res.data.payments?.find((item: { showPay: any }) => item.showPay)
          setTotalAmount(datas?.payAmount || res.data.totalAmount)
          setPayments(datas)
          setDetailData(res.data)
          if (res.data.outerStatus === 6 || res.data.outerStatus === 8) {
            fnGetAllType(res.data)
          }
          if (res.data.innerStatus === 2) {
            setInnerStatus(1)
          }
          if (res.data.innerStatus === 4) {
            setInnerStatus(2)
          }
          if (res.data.deliverDate && typeof res.data.deliverDate === 'string') {
            const params = {
              shopId: res.data?.shopId,
              vendorMemberId: res.data.vendorMemberId,
              vendorRoleId: res.data.vendorRoleId,
            }
            getOrderMobileCreateFindDeliveryDate(params).then((resTime: any) => {
              if (resTime.code === 1000) {
                setRandTimeData(resTime.data)
              }
            })
          }
        }
      })
    } catch (error) {}
  }
  const handleCodeFinishPay = async (value: string) => {
    const datas = detailData.payments.find((item: { showPay: any }) => item.showPay)
    if (fundModeRef.current.payAll < datas.payAmount) {
      Toast.show({
        icon: 'none',
        title: intl.formatMessage({
          id: 'order.jifenbuzu',
          defaultMessage: '积分不足',
        }),
      })
      return
    }
    const params = {
      batchNo: datas?.batchNo,
      fundMode: fundModeRef.current.payFunMode,
      orderIds: [detailData?.orderId],
      payChannel: datas?.payChannel,
      payPassword: encryptedByAES(value),
      payType: datas?.payType,
    }
    const { code, data, message } = await postOrderCreateBuyerPay(params as any)
    Toast.show({
      icon: 'none',
      title: intl.formatMessage({
        id: `${code}`,
        defaultMessage: message,
      }),
    })
    if (code === 1000) {
      getDetailInfo()
    }
    handleClosePay()
  }
  /**
   * 选择送货时间
   * @param selectData 选择的时间日期
   */
  const fnDeliveryTimeCallBlack = (selectData: any) => {
    const params = {
      orderId: detailData.orderId,
      deliverPeriod: selectData.startTime
        ? `${selectData.selectData} ${selectData.startTime}-${selectData.endTime}`
        : selectData.selectData,
      reason: '',
    }
    postOrderMobileBuyerUpdateDeliveryTime(params).then((res) => {
      Toast.show({
        icon: 'none',
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
      })
      handleTimeClose()
      if (res.code === 1000) {
        setDetailData({
          ...detailData,
          deliverDate: params.deliverPeriod,
        })
      }
    })
  }
  const showTitle = () => {
    if (headText) {
      if (detailData?.outerStatus === 13) {
        return detailData?.outerStatusName
      }
      return sendInfo.outerStatusName
    }
    return ''
  }
  const dqrTitle = sendInfo.outerStatus === 13
  const dqr = dqrTitle && !noBtnClick
  return (
    <View className={styles.container}>
      <Header
        title={
          <Text
            style={{
              lineHeight: pxTransform(60),
              fontSize: pxTransform(14),
              textAlign: 'center',
              color: '#FFF',
            }}
          >
            {showTitle()}
          </Text>
        }
        customRenderLeft={
          <View
            style={{
              flex: 2,
            }}
          >
            <Icons
              name="ChevronLeft"
              size={24}
              color="#FFF"
              onClick={() =>
                Router.navigateTo('order/mycommodityList', {
                  Index: categoryIndex || '0',
                })
              }
            />
          </View>
        }
        customStyle="background:#00A98F"
      />
      <ScrollView scrollY onScroll={Scroll} className={styles['scroll-style']}>
        <View className={styles['status']}>
          <Text className={styles['status-txet']}>
            {detailData?.outerStatus === 13 ? detailData?.outerStatusName : sendInfo.outerStatusName}
            {detailData?.outerStatus === 1 && '>'}
          </Text>

          {dqr && !detailData.pickupPointName && (
            <Text
              style={{
                fontSize: pxTransform(12),
                color: '#fff',
                marginTop: pxTransform(8),
              }}
            >
              {intl.formatMessage({
                id: 'order.cidingdanbaohan',
                defaultMessage: '此订单包含',
              })}
              {detailData?.deliveries?.length}{' '}
              {intl.formatMessage({
                id: 'order.gewuliudan',
                defaultMessage: '个物流单',
              })}
            </Text>
          )}
        </View>
        <View
          className={styles.mian}
          style={{
            marginTop: pxTransform(dqr && detailData?.deliveries ? -30 : 0),
          }}
        >
          {/* 待审核 */}
          {/* <Examine dataSource={detailData}/> */}
          {/* 待提交  */}
          {!dqr && (
            <StaySubmit
              dataSource={detailData}
              outerStatusName={sendInfo.outerStatusName}
              fnClosePayType={fnShowPayType}
              fnShowTime={fnShowTime}
              getDisplayInvoice={playInvoice}
              showAfterSale={showAfterSales === 'false' || !showAfterSales ? false : true}
              noBtn={noBtn}
              countdown={countdown}
              totalAmount={totalAmount}
            />
          )}
          {/*  */}
          {dqr &&
            (detailData?.pickupPointName && detailData?.products ? (
              <View className={styles['cbg-receive-product-list']}>
                {detailData.products.map((item) => (
                  <View key={item.orderProductId.toString()} className={styles['cbg-receive-product-list-item']}>
                    <View className={styles['top']}>
                      <Image className={styles['main-img']} src={item.logo} />
                      <View className={styles['info']}>
                        <View className={styles['info-name']}>{item.name}</View>
                        <View className={styles['info-spec']}>{item.spec}</View>
                      </View>
                    </View>
                    <View className={styles['middle']}>
                      <View>
                        {intl.formatMessage({ id: 'order.fahuoshuliange', defaultMessage: '发货数量' })}({item.unit}):
                        <Text className={styles['middle-num']}>{item.quantity}</Text>
                      </View>
                      <View>
                        {intl.formatMessage({ id: 'order.shouhuoshuliange', defaultMessage: '收货数量' })}({item.unit}):
                        <Text className={styles['middle-num']}>0</Text>
                      </View>
                    </View>
                    <View className={styles['footer']}>
                      <View
                        className={styles['footer-active']}
                        style={{ width: `${Math.max(0, Math.min(1, 0 / item.quantity)) * 100}%` }}
                      >
                        <Image className={styles['tag-img']} src={getOssUrlPath(`/Images/receiving.svg`)} />
                      </View>
                    </View>
                  </View>
                ))}
                <View className={styles['cbg-receive-product-list-count']}>
                  共{detailData.products.length}条商品数据
                </View>
              </View>
            ) : (
              detailData?.deliveries && (
                <Receiving dataSource={detailData?.deliveries} sendInfo={sendInfo} setSendInfo={setSendInfo} />
              )
            ))}
        </View>
      </ScrollView>
      {/* 底部按钮 */}
      {!noBtn && (!noBtnClick || !dqrTitle) && (
        <Foot
          dataSource={detailData}
          sendInfo={sendInfo}
          status={innerStatus}
          categoryIndex={categoryIndex}
          showCancel={showCancel}
          showSubmit={showSubmit}
          fnClosePayType={fnShowPayType}
          totalAmount={totalAmount}
        />
      )}
      {/* 支付 */}
      <PayType
        payTypeList={payTypeMessage.payTypes}
        showPayType={showPayType}
        orderDetailData={detailData}
        fnClose={() => {
          fnClosePayType()
        }}
        fnDetermineProps={fnDeterminePayType}
      />
      {visiblePay && (
        <PayPopupInput
          scoreValue={`${Number(detailData?.totalAmount)}积分`}
          onCodeFinish={handleCodeFinishPay}
          popupTitle="积分支付"
          visible={visiblePay}
          onClose={handleClosePay}
        />
      )}
      {/* 发票 */}
      <Invoice
        cancelOrderVisible={visible}
        onHandleClose={handleClose}
        onConfirm={handleConfirm}
        invoice={detailData?.invoice}
      />
      {/* 送货时间 */}
      {visibleTime && (
        <DeliveryTime
          newRanTime={randTimeData}
          showTimeLayer={visibleTime}
          fnClose={handleTimeClose}
          callBlackFn={fnDeliveryTimeCallBlack}
        />
      )}
      <Overlays visible={modalVisible} position="center">
        <View className={styles.modelWrap}>
          <View className={styles.modelMmian}>
            <View className={styles.title}>
              <Text>
                {intl.formatMessage({
                  id: 'order.yanzhengma',
                  defaultMessage: '验证码',
                })}
              </Text>
              <Icons className={styles.closeIcon} name="CloseFill" color="#E3E4E5" size={12} onClick={fnCloseCode} />
              {/* <Text className={styles.closeIcon} onClick={fnCloseCode}>关闭</Text> */}
            </View>
            <View className={styles.modeCard}>
              <Text
                style={{
                  fontSize: pxTransform(12),
                  marginTop: pxTransform(10),
                }}
              >
                {intl.formatMessage({
                  id: 'order.yijiangyanzhengmafasongzhi',
                  defaultMessage: '已将验证码发送至您的手机号',
                })}
              </Text>
              <CodeInput autoFocus onFinish={handleFinish} maxLength={payMessageType?.payChannel === 15 ? 5 : 6} />
            </View>
          </View>
        </View>
      </Overlays>
    </View>
  )
}
export default GlobalWrapper(MyCommodityDetails)
