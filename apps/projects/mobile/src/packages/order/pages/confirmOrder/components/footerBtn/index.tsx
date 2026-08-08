import React, { useEffect, useState } from 'react'
import { View, Text, Toast, Icons, Modal } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import {
  pxTransform,
  showLoading,
  hideLoading,
  preload,
  login,
  requestPayment,
  showToast,
} from '@apps/mobile-services/utils/taro'
import { requestSubscribeMessage } from '@tarojs/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { ENVIRONMENT, IS_WEB } from '@/constants'
import { SOURCE_TYPE, PAY_TYPE } from '@/constants/const/payResult'
import { encryptedByAES } from '@linkseeks/crypto'
import { isWeChat } from '@/utils'
import { dateFormat } from '@/utils/date'
import useStores from '@/store/useStores'
import useWechatPay from '@/hooks/useWechatPay'
import Overlays from '@/components/Overlay'
import CodeInput from '@/components/CodeInput'
import {
  postOrderMobileCreateB2b,
  postOrderMobileCreateBuyer,
  postOrderMobileCreateBuyerPay,
  postOrderMobileCreateGroup,
  PostOrderMobileCreateLrcListResponse,
  postOrderMobileCreateCbgBuyer,
} from '@apps/apis'
import { postPayEAccountAllInPayConfirmPay } from '@apps/apis'
import { fnGetPromotionAmount, fnGetselectCouponMoney } from '../../../../commonlyFn'
import useProduct from '../../hooks/useProduct'
import styles from './index.module.scss'
import { useToggle } from '@linkseeks/hooks'
import { useEAccountMemberInfo } from '@apps/services/eAccount/hooks/useEAccountMemberInfo'

interface Iprops {
  id?: string
  cbgActivityId?: number | null
  cbgTeamLeaderId?: number | null
  deliveryType?: boolean | null
  allPrice: any
  fnFullScreenLoading: Function
  freightTotal: number
  selectCoupon: any
  payTypeMessage: any
  selectItem: any
  logisticsType: boolean
  selectIntegral: PostOrderMobileCreateLrcListResponse
  taxation: number
  orderContractType?: number
  askPurchaseQuoteId?: string
}
const FooterBtn: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const {
    id,
    cbgActivityId,
    deliveryType,
    allPrice,
    fnFullScreenLoading,
    freightTotal,
    selectCoupon,
    payTypeMessage,
    selectItem,
    logisticsType,
    selectIntegral,
    taxation,
    orderContractType,
    askPurchaseQuoteId,
  } = props
  const { wxPay } = useWechatPay()
  const [spendCode, setSpendCode] = useState(0)
  const [spendCodeMessage, setSpendCodeMessage] = useState<any>({})
  const [PayMessageCode, setPayMessageCode] = useState<any>({})
  const [Modalvisible, setModalvisible] = useState(false)

  const [eAccountVisible, toggleEAccountVisible] = useToggle()
  const {
    purchaseOrderStore: { shopMessageStore },
    confirmOrderStore: { socialDistributionInvitationCode },
    confirmOrderStore: {
      selfPickupInfo,
      addressInfo,
      orderInfo,
      paymentInfo,
      orderstore,
      orderMessage,
      setOrderMessage,
    },
    userStore: { shopAndSite, setInvoiceInfo, invoiceInfo },
  } = useStores()

  const { memberInfo, isFinishProcess, isSelf, isEnterprise, isFinishMoneyProcess } = useEAccountMemberInfo({
    isRefresh: true,
  })
  const { productList, needFreight } = useProduct()

  const gnGetPriceWhole = (type: String) => {
    const pristr = `${allPrice}`
    const priceArr = pristr.split('.')
    if (type === 'whole') {
      return priceArr[0] || 0
    }
    return priceArr[1] || '00'
  }
  /**
   *  获取发票参数
   */
  const fnGetInvoiceInfo = () => {
    if (!invoiceInfo || !invoiceInfo.id) {
      return null
    }
    const obj = {
      // 发票信息，如订单没有发票不需要填写此字段 ,OrderInvoiceVO
      invoiceId: invoiceInfo?.id, // 发票Id
      invoiceKind: invoiceInfo?.kind, // 发票种类，1-企业，2-个人
      invoiceType: invoiceInfo?.type, // 发票类型，1-增值税普通发票，2-增值税专用发票
      title: invoiceInfo?.invoiceTitle, // 发票台头
      taxNo: invoiceInfo?.taxNo, // 纳税号
      bank: invoiceInfo?.bankOfDeposit, // 开户银行
      account: invoiceInfo?.account, // 账号
      address: invoiceInfo?.address, // 地址
      phone: invoiceInfo?.tel, // 电话
      defaultInvoice: invoiceInfo?.isDefault, // 是否默认，true-是，false-否
    }
    return obj
  }
  /**
   * 返回送货时间列表
   */
  const fnGetDeliverTime = () => {
    const deliverTime: any = []
    Object.keys(shopMessageStore).forEach((key: string) => {
      if (shopMessageStore[key][0] && shopMessageStore[key][0].delivery) {
        const { delivery } = shopMessageStore[key][0]
        if (!delivery.startTime || !delivery.endTime) {
          // 有配送具体时间
          const obj = {
            vendorMemberId: shopMessageStore[key][0].memberId,
            vendorRoleId: shopMessageStore[key][0].memberRoleId,
            deliverTime: `${dateFormat(new Date(delivery.selectData), 'YY-MM-DD HH:mm')}`,
            remark: shopMessageStore[key][0].remark,
            vendorLogo: shopMessageStore[key][0].memberId,
          }
          deliverTime.push(obj)
        } else {
          // 无配送具体时间
          const obj = {
            vendorMemberId: shopMessageStore[key][0].memberId,
            vendorRoleId: shopMessageStore[key][0].memberRoleId,
            deliverTime: `${dateFormat(new Date(delivery.selectData), 'YY-MM-DD')} ${delivery.startTime}-${
              delivery.endTime
            }`,
            remark: shopMessageStore[key][0].remark,
            vendorLogo: shopMessageStore[key][0].memberId,
          }
          deliverTime.push(obj)
        }
      } else if (shopMessageStore[key][0] && shopMessageStore[key][0].remark) {
        // 无配送时间s
        const obj = {
          vendorMemberId: shopMessageStore[key][0].memberId,
          vendorRoleId: shopMessageStore[key][0].memberRoleId,
          deliverTime: null,
          remark: shopMessageStore[key][0].remark,
          vendorLogo: shopMessageStore[key][0].memberId,
        }
        deliverTime.push(obj)
      }
    })
    if (deliverTime.length === 0) {
      return null
    }
    return deliverTime
  }
  /**
   * @returns 优惠卷
   */
  const fnGetCouponsList = () => {
    const couponsList: any = []
    selectCoupon.forEach((item: any) => {
      if (item && item.id) {
        const obj = {
          vendorMemberId: item.memberId, // 优惠券归属的供应会员（店铺）Id
          vendorRoleId: item.roleId, // 优惠券归属的供应会员（店铺）角色Id
          skuId: item.selectSkuId, // 优惠券适用商品的SkuId，如果不是商品优惠券，为空或Null或0
          couponId: item.id, // 优惠券领取id
          name: item.name, // 优惠券名称
          couponType: item.type, // 优惠券类型枚举
          belongType: item.belongType, // 优惠券归属类型枚举
          amount: item.denomination, // 优惠券面额
          startTime: dateFormat(new Date(item.validTimeStart)), // 优惠券有效期起始时间，格式为yyyy-MM-ddHH:mm:ss
          expireTime: dateFormat(new Date(item.validTimeEnd)), // 优惠券有效期结束时间，格式为yyyy-MM-ddHH:mm:ss
        }
        couponsList.push(obj)
      }
    })
    return couponsList
  }
  /**
   * 收货地址，如商品配送方式中包含“物流”，则必须填写 ,OrderConsigneeVO
   * @returns
   */
  const fnGetAddressMess = () => {
    if (cbgActivityId && deliveryType && orderstore && orderstore.teamLeaderId) {
      return {
        consigneeId: orderstore?.teamLeaderId, // 收货人Id
        consignee: orderstore?.name, // 收货人姓名
        provinceCode: orderstore?.pickupPointProvinceCode, // 省编码
        cityCode: orderstore?.pickupPointCityCode, // 市编码
        districtCode: orderstore?.pickupPointAreaCode, // 区编码
        streetCode: orderstore?.pickupPointStreetCode, // 街道编码
        address: orderstore?.pickupPointAddress, // 详细地址
        postalCode: '', // 邮政编码
        countryCode: orderstore?.countryCode, // 国家编码（手机号码前缀）
        phone: orderstore?.phone, // 手机号码
        telephone: '', // 固定电话号码
        defaultConsignee: 1, // 是否默认，true-是，false-否
      }
    }
    if (!addressInfo || !addressInfo?.id) {
      return null
    }
    return {
      consigneeId: addressInfo?.id, // 收货人Id
      consignee: addressInfo?.receiverName, // 收货人姓名
      provinceCode: addressInfo?.provinceCode, // 省编码
      cityCode: addressInfo?.cityCode, // 市编码
      districtCode: addressInfo?.districtCode, // 区编码
      streetCode: addressInfo?.streetCode, // 街道编码
      address: addressInfo?.address, // 详细地址
      postalCode: addressInfo?.postalCode, // 邮政编码
      countryCode: 86, // 国家编码（手机号码前缀）
      phone: addressInfo?.phone, // 手机号码
      telephone: addressInfo?.tel, // 固定电话号码
      defaultConsignee: addressInfo?.isDefault, // 是否默认，true-是，false-否
    }
  }

  const fnInitIntegralPar = () => {
    const deductions: any = []
    selectIntegral.forEach((item: any) => {
      if (!item.vendorMemberId) {
        return
      }
      const obj = {
        vendorMemberId: item.vendorMemberId, // 积分归属的供应会员（店铺）Id
        vendorRoleId: item.vendorRoleId, // 积分归属的供应会员（店铺）角色Id
        vendorName: item.vendorName, // 供应商会员名称
        relType: item.relType, // 积分类型：0=平台；1=会员
        usedPoint: item.enablePoint, // 消费的积分
        amount: item.enableDeductionAmount, // 本单积分可抵扣金额
        deductionRate: item.deductionRate, // 积分抵扣金额比例
      }
      deductions.push(obj)
    })
    return deductions
  }

  const getStoreId = () => {
    if (
      shopMessageStore &&
      Object.keys(shopMessageStore).length > 0 &&
      shopMessageStore[Object.keys(shopMessageStore)[0]].length > 0
    ) {
      console.log('storeId: ', shopMessageStore[Object.keys(shopMessageStore)[0]][0].storeId)
      return shopMessageStore[Object.keys(shopMessageStore)[0]][0].storeId
    }
    return null
  }

  /**
   * 整合创建订单参数
   */
  const fnInitParmes = () => {
    let cbgTeamLeaderId = 0,
      cbgReceiverPickupId = 0,
      cbgReceiverPickupName = '',
      cbgReceiverPickupPhone = ''
    let products = JSON.parse(JSON.stringify(productList))
    if (cbgActivityId) {
      cbgTeamLeaderId = orderstore.teamLeaderId
      products.forEach((product) => {
        product.addressId = ''
        if (deliveryType) {
          product.deliveryType = 2
        }
      })
      if (deliveryType) {
        cbgReceiverPickupId = selfPickupInfo.id
        cbgReceiverPickupName = selfPickupInfo.name
        cbgReceiverPickupPhone = selfPickupInfo.phone
      }
    }
    const obj = {
      askPurchaseQuoteId,
      quoteId: '', // 报价单id
      quoteNo: '', // 报价单单号
      vendorMemberId: '', // 供应会员id
      vendorRoleId: '', // 供应会员角色id
      vendorMemberName: '', // 供应会员名称
      shopId: shopAndSite?.id, // 订单来源商城Id
      shopType: 1, // 商城类型
      shopEnvironment: ENVIRONMENT, // 商城环境 3---小程序 4---app
      shopName: shopAndSite?.name, // 订单来源商城名称
      payType: paymentInfo?.payType || 0, // 支付方式，0-无需支付，1-线上支付，2-线下支付，3-授信额度支付，4-货到付款
      payChannel: paymentInfo?.payChannel || 0, // 支付渠道，0-无需支付，1-支付宝，2-微信，3-银联，4-余额支付，5-线下支付线上确认，6-授信额度支付，7-货到付款
      freight: needFreight && (!cbgActivityId || !deliveryType) ? freightTotal : 0, // 运费
      taxes: taxation || 0, // 税费
      promotionAmount: fnGetPromotionAmount(shopMessageStore, false), // 促销活动优惠金额
      couponAmount: fnGetselectCouponMoney(selectCoupon), // 优惠券优惠金额
      totalAmount: allPrice, // 商品实付价格
      consignee: fnGetAddressMess(), // 收货地址，如商品配送方式中包含“物流”，则必须填写 ,OrderConsigneeVO
      invoice: fnGetInvoiceInfo(),
      storeId: getStoreId(), // 门店id
      // contract: { // 合同信息，如订单没有合同不需要填写此字段 ,OrderContractVO
      //   fileName: '', // 合同文件名称
      //   url: '', // 合同文件Url
      // },
      products, // [] 商品列表 ,MobileOrderProductVO
      deliverTimes: fnGetDeliverTime(), // 订单送货时间列表
      coupons: fnGetCouponsList(), // 优惠卷列表
      deductions: fnInitIntegralPar(), // 积分列表
      orderContractType: payTypeMessage?.hasContract ? orderContractType : '',
      cbgActivityId: cbgActivityId || 0, // 社区团购活动ID
      cbgTeamLeaderId, // 团长ID
      cbgReceiverPickupId, // 自提人ID
      cbgReceiverPickupName, // 自提人姓名
      cbgReceiverPickupPhone, // 自提人电话
      socialDistributionInvitationCode: socialDistributionInvitationCode || '', // 邀请人
    }
    return obj
  }
  /**
   * 微信支付
   */
  const onConfirm = async (newOrderMessage: any, otherObj: any) => {
    // H5 通联微信支付 需拉起小程序进行支付
    if (IS_WEB && newOrderMessage.payChannel === 11) {
      preload('params', {
        money: newOrderMessage.payAmount,
        newOrderMessage: encryptedByAES(JSON.stringify(newOrderMessage)),
      })
      Router.navigateTo('order/payResult', {
        type: SOURCE_TYPE.ORDER,
        isMiniPay: 1,
        payType: PAY_TYPE.WECHATPAY_MINIPROGRAM_ORG,
      })
      return
    }
    // 判断环境是否为H5且为微信浏览器
    const wechatBrowser = IS_WEB && isWeChat() ? 1 : 0
    if (wechatBrowser) {
      // 这里H5微信浏览器走该逻辑
      // 微信内 H5 支付需要静默授权获取code
      preload('params', {
        isJsSdkWechatPay: true,
        newOrderMessage: encryptedByAES(JSON.stringify(newOrderMessage)),
      })
      Router.navigateTo('order/payResult', { type: SOURCE_TYPE.ORDER, orderId: newOrderMessage.orderIds[0] })
      return
    }
    const weChatCode = IS_WEB ? null : (await login()).code
    // let money: any = value.replace(/\D/g, '').replace(/...(?!$)/g, '$&');
    // const money = Number(newOrderMessage.payAmount);
    const pendingOrderPayRes = await postOrderMobileCreateBuyerPay({
      ...newOrderMessage,
      weChatCode,
    })
    if (pendingOrderPayRes.code != 1000) {
      Toast.show({
        title: pendingOrderPayRes.message,
        icon: 'none',
      })
      return
    } else {
      try {
        const weChatPayParams = pendingOrderPayRes.data
        const codeUrl = JSON.parse(weChatPayParams.codeUrl)
        if (!IS_WEB) {
          requestPayment({
            timeStamp: codeUrl.timeStamp,
            nonceStr: codeUrl.nonceStr,
            package: codeUrl.package,
            signType: codeUrl.signType,
            paySign: codeUrl.paySign,
            success: function (res) {
              Router.redirectTo('order/SubmitSuccess', {
                orderId: newOrderMessage.orderIds[0],
                storeId: otherObj.storeId,
              })
            },
            fail: function (res) {
              // Toast.show({ title: res, icon: 'none' })
            },
          })
        } else {
          Router.navigateTo('order/payResult', {
            type: SOURCE_TYPE.ORDER,
            tradeCode: pendingOrderPayRes.data.tradeNo,
            url: codeUrl.mwebUrl,
            payType: PAY_TYPE.WECHATPAY_H5_OPEN,
          })
        }
      } catch (erorr) {
        console.error(erorr)
      }
    }
  }
  /**
   * 账期支付
   */
  const fnDirectPay = async (newOrderMessage: any) => {
    const param = {
      orderIds: newOrderMessage.orderIds,
      payType: newOrderMessage.payType,
      payChannel: newOrderMessage.payChannel,
      batchNo: newOrderMessage.batchNo,
      fundMode: newOrderMessage.fundMode,
      // returnUrl: `order/SubmitSuccess?orderId=${newOrderMessage.orderIds[0]}&storeId=${newOrderMessage.storeId}`,
    }
    const { data, code, message } = await postOrderMobileCreateBuyerPay(param)
    // hideLoading()
    if (code === 1000) {
      if (newOrderMessage.payChannel === 17) {
        Router.redirectTo('extra/webview', {
          webUrl: data.codeUrl,
          orderId: newOrderMessage.orderIds[0],
          storeId: newOrderMessage.storeId,
          tradeNo: data.tradeNo,
        })
        // Router.redirectTo('basicSetting/webViewRMB', {
        //   // payHtml: encryptedByAES(data.codeUrl),
        //   tradeNo: data.tradeNo,
        // })
        return
      }
      Router.redirectTo('order/SubmitSuccess', {
        orderId: newOrderMessage.orderIds[0],
        storeId: newOrderMessage.storeId,
      })
    } else {
      showToast({ title: message })
      // setVisible(false);
    }
  }

  /**
   * 发送验证码
   */
  const fnSpendCode = async () => {
    Toast.show({
      title: intl.formatMessage({ id: 'confirmOrder_components_footerBtn_fnSpendCode_show_1' }),
      icon: 'none',
    })
    const { data, code, message } = await postOrderMobileCreateBuyerPay({
      orderIds: orderMessage.orderIds,
      payType: orderMessage.payType,
      payChannel: orderMessage.payChannel,
      batchNo: orderMessage.batchNo,
      fundMode: orderMessage.fundMode,
    })
    hideLoading()
    if (code === 1000) {
      setPayMessageCode(data)
      setModalvisible(true)
      Toast.show({
        title: intl.formatMessage({ id: 'confirmOrder_components_footerBtn_fnSpendCode_show_2' }),
        icon: 'none',
      })
    } else {
      Toast.show({ title: message, icon: 'none' })
      // setVisible(false);
    }
  }

  /**
   * 支付宝支付/通联-支付宝支付
   */
  const onConfirmToAliPay = async (newOrderMessage: any) => {
    showLoading()
    const res = await postOrderMobileCreateBuyerPay({
      ...newOrderMessage,
    })
    hideLoading()
    if (res.code === 1000) {
      const URL_KEY = newOrderMessage.payChannel === 12 ? 'url' : 'codeUrl'
      Router.navigateTo('order/payResult', {
        type: SOURCE_TYPE.ORDER,
        tradeCode: res.data.tradeNo,
        orderId: newOrderMessage.orderIds[0],
        storeId: newOrderMessage.storeId,
        [URL_KEY]: res.data.codeUrl,
        payType: PAY_TYPE.SCAN_ALIPAY,
      })
    } else {
      Toast.show({ title: res.message, icon: 'none' })
    }
  }
  /**
   * 结算
   */
  let isLoading = false
  const confirmOrder = () => {
    if (isLoading) {
      return
    }
    if (!logisticsType) {
      Toast.show({ title: '不在配送范围', icon: 'none' })
      return
    } else if (cbgActivityId && deliveryType && !selfPickupInfo) {
      Toast.show({ title: '请选择提货人', icon: 'none' })
      return
    }
    const params = fnInitParmes()
    if (!params.payType && payTypeMessage.required) {
      Toast.show({
        title: intl.formatMessage({ id: 'confirmOrder_components_footerBtn_fnJumpPay_show' }),
        icon: 'none',
      })
      return
    }
    isLoading = true
    requestSubscribeMessage({
      tmplIds: [
        '5lBn5Zue8RXLmJ0Yy3hAVnuP386SJNMAjjKo5A4hZwQ',
        '_T449zFDpevGxPUcW5p0Duo-tNDXyz1ZtuaA0pxzvRI',
        'qNjK-bSgSjAc7nQUYL9fEzP7UMI5l5L_gmAXvaK6NXM',
      ],
      entityIds: [],
      complete: () => {
        fnJumpPay(params)
      },
    })
  }
  const fnJumpPay = async (params) => {
    if (!IS_WEB) {
      params['appletJsCode'] = (await login()).code
    }

    const otherObj = {
      vendorMemberId: params.products[0].vendorMemberId,
      vendorRoleId: params.products[0].vendorRoleId,
      storeId: params.products[0].storeId,
    }
    // 判断是不是物流加自提如果是的话，给他一个门店id
    if (Object.keys(selectItem).length > 0 && selectItem.Index) {
      params.storeId = selectItem.logisticsMessage.storeId
    }
    let servicesApi = postOrderMobileCreateBuyer // 普通的
    if (!!cbgActivityId) {
      // 社区团购
      servicesApi = postOrderMobileCreateCbgBuyer
      params.products.forEach((item) => {
        item.promotions = []
      })
    } else {
      Object.keys(shopMessageStore).forEach((key: string) => {
        if (shopMessageStore[key][0]?.isGroupPurchasing) {
          // 是否为评团
          servicesApi = postOrderMobileCreateGroup
        }
        if (shopMessageStore[key][0] && shopMessageStore[key][0].quoteId) {
          params.quoteId = shopMessageStore[key][0].quoteId
          params.quoteNo = shopMessageStore[key][0].quoteNo
          params.vendorMemberId = params.products[0].vendorMemberId
          params.vendorRoleId = params.products[0].vendorRoleId
          params.vendorMemberName = params.products[0].vendorMemberName
          servicesApi = postOrderMobileCreateB2b
        }
      })
    }

    // 通联支付的所有种类编号
    const eAccountList = [11, 12, 13, 15]
    if (eAccountList.includes(paymentInfo.payChannel)) {
      if (memberInfo?.memberType === 2) {
        // 只要绑定了手机号即可使用通联支付
        if (!memberInfo.isPhoneChecked) {
          toggleEAccountVisible()
          return
        }
      } else if (memberInfo?.memberType === 1) {
        // 企业会员
        if (memberInfo.step < 2) {
          toggleEAccountVisible()
          return
        }
      }
    }
    fnFullScreenLoading('show')
    servicesApi(params).then((res) => {
      fnFullScreenLoading('hidden')
      setInvoiceInfo(null)
      isLoading = false
      if (res.code !== 1000) {
        if (res.code === 2031) {
          toggleEAccountVisible()
          return
        }
        if (res.code === 56042) {
          Toast.show({
            title: intl.formatMessage({
              id: 'commodityMerge.common.limit.tip',
              defaultMessage: '已达到活动最大限购数量，您最多可购买{{num}}件！',
              num: res.message,
            }),
            icon: 'none',
          })
          return
        }
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      const newOrderMessage = { ...res.data, ...otherObj }
      setOrderMessage(newOrderMessage)
      if (!newOrderMessage.paymentRequired) {
        Router.redirectTo('order/SubmitSuccess', {
          orderId: newOrderMessage.orderIds[0],
          storeId: otherObj.storeId,
        })
      } else if (paymentInfo.payChannel === 4) {
        // 余额支付
        // setVisible(true);
        Router.redirectTo('order/payOrder', {
          orderId: newOrderMessage.orderIds[0],
          storeId: otherObj.storeId,
        })
      } else if (paymentInfo.payChannel === 2) {
        // 微信
        onConfirm(newOrderMessage, otherObj)
      } else if (paymentInfo.payChannel === 1) {
        // 支付宝
        if (IS_WEB) {
          onConfirmToAliPay(newOrderMessage)
        }
      } else if (paymentInfo.payChannel === 5) {
        // 线下支付线上确认
        // navigation.navigate("CreditOfflineRepayment");
        Router.redirectTo('order/offlineTransfer', {
          orderId: newOrderMessage.orderIds[0],
          storeId: otherObj.storeId,
        })
      } else if (paymentInfo.payChannel === 6) {
        // 授信额度支付
        // setVisible(true);
        Router.redirectTo('order/payOrder', {
          orderId: newOrderMessage.orderIds[0],
          storeId: otherObj.storeId,
        })
      } else if (paymentInfo.payChannel === 7) {
        // 货到付款
        if (newOrderMessage.paymentRequired) {
          fnDirectPay(newOrderMessage)
        } else {
          Router.redirectTo('order/SubmitSuccess', {
            orderId: newOrderMessage.orderIds[0],
            storeId: otherObj.storeId,
          })
        }
      } else if (paymentInfo.payChannel === 11) {
        // 通联支付-微信支付
        onConfirm(newOrderMessage, otherObj)
      } else if (paymentInfo.payChannel === 12) {
        // 通联支付-支付宝
        if (IS_WEB) {
          onConfirmToAliPay(newOrderMessage)
        }
      } else if (paymentInfo.payChannel === 13) {
        // 通联支付-快捷支付
        setSpendCode(spendCode + 1)
        setSpendCodeMessage(newOrderMessage)
      } else if (paymentInfo.payChannel === 15) {
        // 通联支付-余额支付
        setSpendCode(spendCode + 1)
        setSpendCodeMessage(newOrderMessage)
      } else if (paymentInfo.payChannel === 9 || paymentInfo.payChannel === 8 || paymentInfo.payChannel === 17) {
        // 结算支付
        fnDirectPay(newOrderMessage)
      } else if (paymentInfo.payChannel === 18) {
        isLoading = false
        fnDirectPay(newOrderMessage)
      }
    })
  }

  // fnFullScreenLoading('hidden');
  const fnCloseCode = () => {
    Router.redirectTo('order/mycommodityDetails', {
      orderId: orderMessage.orderIds[0],
      categoryIndex: 0,
    })
    setModalvisible(false)
  }
  /**
   *0输入验证码
   * @param val 验证码
   */
  const handleFinish = async (val: string) => {
    showLoading({ title: intl.formatMessage({ id: 'confirmOrder_components_footerBtn_handleFinish_show' }) })
    const { data, code, message } = await postPayEAccountAllInPayConfirmPay({
      tradeCode: PayMessageCode.tradeNo, // 订单号
      verificationCode: val, // 短信验证码
    })
    hideLoading()
    if (code === 1000) {
      Router.redirectTo('order/SubmitSuccess', {
        storeId: spendCodeMessage.storeId,
        orderId: spendCodeMessage.orderIds[0],
      })
    } else {
      Toast.show({ title: message })
      // setVisible(false);
    }
  }
  useEffect(() => {
    if (spendCode > 0) {
      fnSpendCode()
    }
  }, [spendCode])

  const eAccountConfirm = async () => {
    toggleEAccountVisible()

    if (isSelf) {
      if (memberInfo?.isPhoneChecked) {
        // 已绑定手机
        Router.navigateTo('basicSetting/accountHome')
      } else {
        // 未绑定手机，并且是个人用户,前往绑定
        Router.navigateTo('basicSetting/bindphone')
      }
    } else if (isEnterprise) {
      if (isFinishProcess) {
        // 已经完成绑定
        Router.navigateTo('basicSetting/accountHome')
      } else {
        Router.navigateTo('basicSetting/entErpriseAuth')
      }
      console.log('企业类型')
    }
  }
  return (
    <View className={styles['bottom-container']} id={id}>
      <View className={styles['price-warp']}>
        <Text className={styles['btntext']}>
          {intl.formatMessage({ id: 'confirmOrder_components_footerBtn_btntext' })}
        </Text>
        <Text className={styles['btn-price-small']}>{intl.formatMessage({ id: 'currency' })}</Text>
        <Text className={styles['btn-price']}>{gnGetPriceWhole('whole')}</Text>
        <Text className={styles['btn-price-small']}>{`.${gnGetPriceWhole('decimal')}`}</Text>
      </View>
      {/* fnJumpPay */}
      {/* {
           && (
          <View className={styles['sub-btn']} onClick={fnJumpPay}>
            <Text className={styles['sub-btn-text']}>{intl.formatMessage({id: 'confirmOrder_components_footerBtn_subBtnText'})}</Text>
          </View>
        )

      } */}
      <View className={`${styles['sub-btn']} ${!logisticsType && styles['sub-un-btn']}`} onClick={confirmOrder}>
        <Text className={styles['sub-btn-text']}>
          {intl.formatMessage({ id: 'confirmOrder_components_footerBtn_subBtnText' })}
        </Text>
      </View>

      {/* 更换手机号模态框 */}
      <Overlays visible={Modalvisible} position="center">
        <View className={styles.modelWrap}>
          <View className={styles.modelMmian}>
            <View className={styles.title}>
              <Text>{intl.formatMessage({ id: 'confirmOrder_components_footerBtn_title' })}</Text>
              <Icons className={styles.closeIcon} name="CloseFill" color="#E3E4E5" size={12} onClick={fnCloseCode} />
              {/* <Text className={styles.closeIcon} onClick={fnCloseCode}>关闭</Text> */}
            </View>
            <View className={styles.modeCard}>
              <Text style={{ fontSize: pxTransform(12), marginTop: pxTransform(10) }}>
                {intl.formatMessage({ id: 'confirmOrder_components_footerBtn_modeCard' })}
              </Text>
              <CodeInput autoFocus onFinish={handleFinish} maxLength={paymentInfo?.payChannel === 15 ? 5 : 6} />
            </View>
          </View>
        </View>
      </Overlays>

      <Modal
        title={'抱歉，您未开通通联支付，是否立即开通？'}
        isOpened={eAccountVisible}
        onConfirm={eAccountConfirm}
        onClose={toggleEAccountVisible}
        onCancel={toggleEAccountVisible}
        cancelText={'取消'}
        confirmText={'去开通'}
        className={styles['account-model']}
      />
    </View>
  )
}
export default observer(FooterBtn)
