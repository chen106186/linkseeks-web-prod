import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image, Icons, Toast, ScrollView, Radio, Modal } from '@apps/mobile-ui'
import {
  createSelectorQuery,
  getSystemInfoSync,
  useDidShow,
  setNavigationBarTitle,
  pxTransform,
  useRouter,
} from '@apps/mobile-services/utils/taro'
import cs from 'classnames'
import Router from '@/utils/router'
import { observer } from 'mobx-react-lite'
import GlobalHeader from '@/components/NavBar'
import useStores from '@/store/useStores'
import { THEME_COLORS } from '@/constants/theme'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import {
  PostOrderMobileCreatePaymentFindResponse,
  getContractSignatureAuthAuthStatus,
  postOrderBuyerProductFreeFreight,
  postOrderMobileCreatePaymentFind,
  getLogisticsMobileReceiverAddressListDefault,
  getOrderMobileCbgReceiverPickupList,
  getLogisticsShipperAddressGet,
  postMarketingMobileActivityGoodsPriceCalculate,
  postMarketingMobileCouponListByOrder,
} from '@apps/apis'
import Address from './components/address'
import CommodutyCard from './components/commodutyCard'
import FooterBtn from './components/footerBtn'
import CommodityList from './components/commodityList'
import LogisticsLayer from './components/logisticsLayer'
import CouponLayer from './components/couponLayer'
import IntegralLayer from './components/integralLayer'
import PayType from './components/payType'
import DeliveryTime from './components/deliveryTime'
import Cell from './components/Cell'
import DeliveryTypePopup from './components/DeliveryTypePopup'
import usePrice from './hooks/usePrice'
import useProduct from './hooks/useProduct'
import { fnGetCheckPar, fnInitListCalculate } from '../purchase/commonlyFn'
import {
  fnGetPromotionAmount,
  fnGetMemberDisCountAmount,
  fnGetCgbAmount,
  fnGetselectCouponMoney,
  fnGetselectIntegralMoney,
  fnGetSkuId,
  fnKeepTwo,
  fnGetSku,
  fnGetPriceSection,
  fnGetNewEstimatePrice,
} from '../../commonlyFn'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
import { combinationAddress } from '@/utils/dataMerge'
import useDeliverable from '@/hooks/useDeliverable'
import isEmpty from 'lodash/isEmpty'

const ConfirmOrder: React.FC = () => {
  const intl = useIntl()
  const {
    purchaseOrderStore: { shopMessageStore, setShopMessageStore },
    userStore: { shopAndSite, userInfo, invoiceInfo, setInvoiceInfo },
    confirmOrderStore: {
      deliveryType: deliveryTypeStore,
      addressInfo,
      selfPickupInfo,
      setAddressInfo,
      setSelfPickupInfo,
      clearOrderInfo,
      orderInfo,
      paymentInfo,
      setPaymentInfo,
      orderstore,
    },
  } = useStores()
  const router = useRouter<{
    askPurchaseQuoteId?: string
    quoteId?: string
    cbgActivityId?: string
    defaultDeliveryType?: string
  }>()
  const {
    params: { askPurchaseQuoteId, quoteId, cbgActivityId, defaultDeliveryType },
  } = router
  const [hasOtherRecieveAddress, setHasOtherRecieveAddress] = useState<boolean>(false) // 存在其他收货地址
  const [hasOtherSelfPickupInfo, setHasOtherSelfPickupInfo] = useState<boolean>(false) // 存在其他提货人
  const [showCommodityList, setShowCommodityList] = useState(false) // 显示商品列表
  const [showLogisticsLayer, setShowLogisticsLayer] = useState(false) // 显示物流信息
  const [showTimeLayer, setShowTimeLayer] = useState(false) // 显示送货时间
  const [newShop, setNewShop] = useState<any>({}) // 当前操作的商店
  const [newRanTime, setNewRanTime] = useState<any>({})
  const [logisticsLayer, setLogisticsLayer] = useState<any>({})
  const [showCouponLayer, setShowCouponLayer] = useState(false) // 显示优惠卷信息
  const [showIntegralLayer, setShowIntegralLayer] = useState(false) // 显示积分抵扣信息
  const [selectShop, setSelectShop] = useState<any>([]) // 当前选中的商品
  const [payTypeMessage, setPayTypeMessage] = useState<PostOrderMobileCreatePaymentFindResponse>() // 支付方式
  const [newPayType, setNewPayType] = useState<any>(paymentInfo) // 当前支付方式
  const [freightTotal, setFreightTotal] = useState(0)
  const [showPayType, setShowPayType] = useState<boolean>(false)
  const [cardMessage, setCardMessage] = useState<any>({})
  const [scrollViewHeight, setScrollViewHeight] = useState(100)
  const [selectCoupon, setSelectCoupon] = useState<any>([]) // 选中的优惠券
  const [selectIntegral, setSelectIntegral] = useState<any>([]) // 选中的积分
  const [shouldGetCoupon, setShouldGetCoupon] = useState(0)
  const [couponList, setCouponList] = useState<any>([]) // 优惠券列表
  const [taxation, setTaxation] = useState(0) // 税费
  const [SelectItem, setSelectItem] = useState<any>({ Index: 0 }) // 选中的自提地址
  const [vendorMember, setVendorMember] = useState<any>({}) // 供应商id
  const [logisticsType, setLogisticsType] = useState<boolean>(true) // 控制能否点击提交按钮
  const [areaList, setCommodityAreaList] = useState<any>([]) // 获取配送范围地址
  const [allArea, setIsAllArea] = useState<boolean>(false)
  const [isCrossBorder, setIsCrossBorder] = useState<boolean>(false)
  const [deliveryType, setDeliveryType] = useState<boolean>(false) // 配送还是自体
  const [visibleDeliveryType, setVisibleDeliveryType] = useState<boolean>(false) // 选择配送方式弹窗
  const [sendAddress, setSendAddress] = useState<number>(0) // 获取默认的自提地址id
  const { newPrice, estimatePrice, couponPrice, logisticsIds, skuIdListObj } = usePrice({
    cbgActivityId: !cbgActivityId || isNaN(+cbgActivityId) ? 0 : +cbgActivityId,
    cbgDeliveryType: deliveryTypeStore,
  })
  const { needFreight } = useProduct()
  const [signatures, setSignatures] = useState<boolean>(false) //是否有电子签章
  const [orderContractType, setOrderContractType] = useState<1 | 2>(2) // 1.电子合同  2.纸质合同
  const [isOpenedContract, setIsOpenedContract] = useState(false)
  const { isDeliverable } = useDeliverable()
  const translate = useMobileIntl()

  /** 是否询价-生成订单 */
  const isInquireOrder = askPurchaseQuoteId || quoteId
  const CONTRACT_TYPES = [
    {
      label: translate('mobile.resource.order.dianzihetong'),
      value: 1,
    },
    {
      label: translate('mobile.resource.order.zhizhihetong'),
      value: 2,
    },
  ]
  const getSignatures = () => {
    getContractSignatureAuthAuthStatus().then((res) => {
      if (res.code === 1000) {
        setSignatures(res.data)
      }
    })
  }
  useEffect(() => {
    getSignatures()
  }, [])
  const switchContract = (value) => {
    if (value === 1 && !signatures) {
      setIsOpenedContract(true)
      return
    }
    setOrderContractType(value)
  }
  const handleGoBack = () => {
    clearOrderInfo()
    Router.navigateBack()
  }
  /**
   *
   * @param url 跳转路径
   */
  const handleJump = (url: any) => {
    Router.navigateTo(url, {
      handleSelectInvoice: 1,
    })
  }
  /**
   * @param selectShopDesc 关闭商品信息
   */
  const fnCloseCommodityList = (selectShopDesc?: any) => {
    if (selectShopDesc) {
      setSelectShop([...selectShopDesc])
    }
    setShowCommodityList(!showCommodityList)
  }
  /**
   * 关闭物流信息
   */
  const fnCloseLoginsticsLayer = (logisticsLayerDesc: any) => {
    if (logisticsLayerDesc) {
      setLogisticsLayer(logisticsLayerDesc)
    }
    setShowLogisticsLayer(!showLogisticsLayer)
  }
  /**
   *
   * @param shouldDelIntegral 是否需要减去积分的
   * @returns
   */
  const fnGetAllPrice = (shouldDelIntegral = true) => {
    const price = estimatePrice // 商品价格
    const coupon = fnGetselectCouponMoney(selectCoupon) // 优惠卷
    const integral = fnGetselectIntegralMoney(selectIntegral)
    let allPrice = Number(price) - Number(coupon)
    if (needFreight && (!cbgActivityId || !deliveryType)) {
      allPrice += Number(freightTotal)
    }
    if (shouldDelIntegral) {
      allPrice -= Number(integral)
    }
    if (isCrossBorder) {
      // 进口商品需要税率
      allPrice += Number(taxation)
    }
    allPrice = allPrice > 0 ? allPrice : 0
    // if (payTypeMessage?.payNodes && payTypeMessage?.payNodes.length > 1) {
    //   // 分多次支付
    //   allPrice = allPrice * payTypeMessage.payNodes[0].payRate
    // }
    const callBlackPrict = `${fnKeepTwo(allPrice)}`
    return callBlackPrict
  }
  /**
   * 获取运费
   */
  const fnGetFreight = async () => {
    if (addressInfo !== null && addressInfo.id && logisticsIds.length > 0) {
      const parma = {
        productFreightDetailList: logisticsIds,
        receiverAddressId: addressInfo.id,
      }
      const { data } = await postOrderBuyerProductFreeFreight(parma)
      setFreightTotal(data)
    }
  }
  const onElectronicConfirm = () => {
    // Router.navigateTo("Application", {
    //   memberId: userInfo?.memberId,
    //   roleId: userInfo?.memberRoleId,
    // })
  }

  /**
   * 显示｜｜隐藏优惠卷
   */
  const fnCloseCouponLayer = () => {
    setShowCouponLayer(false)
  }
  /**
   * 隐藏支付方式
   */
  const fnClosePayType = () => {
    setShowPayType(!showPayType)
  }
  /**
   * 获取支付方式
   */
  const fnGetAllType = async () => {
    const vendors = fnGetCheckPar(shopMessageStore)
    const params = {
      vendors,
      shopId: shopAndSite?.id, // 订单来源商城Id,
    }
    const { code, data, message } = await postOrderMobileCreatePaymentFind(params)
    if (code === 1000) {
      setPayTypeMessage(data)

      // 拿到数据默认选择微信支付
      data.payTypes.forEach((item) => {
        if (item.payChannel === 11 && item.payType === 6) {
          setNewPayType(item)
          setPaymentInfo(item)
        }
      })
      // setPaymentInfo({})

      // 拿到数据默认选择微信支付
      data.payTypes.forEach((item) => {
        if (item.payChannel === 11 && item.payType === 6) {
          setNewPayType(item)
          setPaymentInfo(item)
        }
      })
      // setPaymentInfo({})
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
   * @param payNodes 订单分次支付
   */
  const fnGetRemarks = (payNodes: any) => {
    // 注：订单金额分${payNodes.length}次支付，
    let callBlackTips = ''
    // const frequency = ['首付', '发货前支付', '发货后支付']
    payNodes.forEach((item: any, index: number) => {
      callBlackTips += `,${item.payNode}${item.payRate * 100}%`
    })
    callBlackTips = intl.formatMessage({
      id: 'confirmOrder_fnGetRemarks',
      payNodesLength: payNodes.length,
      callBlackTips: callBlackTips,
    })
    return callBlackTips
  }
  /**
   * 确定支付方式
   */
  const fnDeterminePayType = (newType: any) => {
    setNewPayType(newType)
    setPaymentInfo(newType)
    fnClosePayType()
  }
  /**
   * 获取收获地址
   */
  const fnGetAddressList = (active: number) => {
    let params = {
      current: '1',
      pageSize: '10',
    }
    if (active === 2) {
      getOrderMobileCbgReceiverPickupList(params).then((res) => {
        if (res.code === 1000) {
          setSelfPickupInfo({} as any)
          // 如果地址只有一个默认取第一个
          let list = res.data.data
          setSelfPickupInfo(list.find((item) => item.isDefault) || list[0])
          setHasOtherSelfPickupInfo(list.length > 1)
        }
      })
    } else {
      getLogisticsMobileReceiverAddressListDefault(params).then((res) => {
        if (res.code === 1000) {
          setAddressInfo({} as any)
          // 如果地址只有一个默认取第一个
          let list = res.data
          setAddressInfo(list.find((item) => item.isDefault) || list[0])
          setHasOtherRecieveAddress(list.length > 1)
        }
      })
    }
  }
  /**
   * 修改蒙版的显示与否
   */
  const fnFullScreenLoading = (type: string) => {
    if (type === 'show') {
      Toast.show({
        title: intl.formatMessage({
          id: 'confirmOrder_fnFullScreenLoading_show',
        }),
        icon: 'loading',
      })
    } else {
      Toast.hide({})
    }
  }
  /**
   *  送货时间的显示与否
   */
  const fnCloseTimeLayer = (newShopDesc?: any, newRanTimeDesc?: any) => {
    if (newShopDesc) {
      setNewShop(newShopDesc)
    }
    if (newRanTimeDesc) {
      setNewRanTime(newRanTimeDesc)
    }
    setShowTimeLayer(!showTimeLayer)
  }
  /**
   * 计算税率
   * */
  const getTaxRate = (item: any) => {
    const { taxRate, count, newPrice: _newPrice } = item
    const Price: any = (taxRate * count * _newPrice) / 100
    setTaxation(Price.toFixed(2))
  }
  // 318 控制提交安
  const setLogistics = (item: { isAllArea: boolean; commodityAreaList: any }) => {
    const { isAllArea, commodityAreaList } = item
    if (isAllArea) {
      setIsAllArea(isAllArea)
    } else if (commodityAreaList) {
      setCommodityAreaList(commodityAreaList)
    }
  }
  /**
   * 初始化商品的到手价格
   */
  const fnInitEstimate = async () => {
    const listCalculate: any = []
    const cardMessageDesc = JSON.parse(JSON.stringify(shopMessageStore))
    Object.keys(cardMessageDesc).forEach((key: string) => {
      cardMessageDesc[key].forEach((item: any) => {
        setLogistics(item)
        setIsCrossBorder(item.isCrossBorder)
        getTaxRate(item)
        if (item.logistics?.deliveryType === 2) {
          setDeliveryType(true)
          setSendAddress(item.logistics?.sendAddressId)
        }
        if (`${item.isMain}` !== 'false') {
          // 套餐的子商品
          const calculate = fnInitListCalculate(item, shopAndSite?.id, item.isGroupPurchasing)
          listCalculate.push(calculate)
        } else if (`${item.isMain}` === 'false' && item.purchaseCommodityType === 4) {
          // 换购商品 要加上价格
          const calculate = fnInitListCalculate(item, shopAndSite?.id, item.isGroupPurchasing)
          listCalculate.push(calculate)
        }
      })
    })
    if (!askPurchaseQuoteId && !cbgActivityId) {
      const { code, data } = await postMarketingMobileActivityGoodsPriceCalculate(listCalculate)
      if (code !== 1000 || !data) {
        return
      }
      data.forEach((newData) => {
        Object.keys(cardMessageDesc).forEach((key: string) => {
          cardMessageDesc[key].forEach((item: any) => {
            if (newData.skuId === item.skuId) {
              // 下面四个价格 肯定有一个 从下到上拿即可
              // groupHandPrice 套餐到手价 handPrice 活动到手价 basePrice 会员比例后的价格 commodityPrice 策略价格
              // ps 商品的setMealId 就是 到手价的 groupNo 不同后台的不通字段
              if (item.setMealId && newData.groupNo === item.setMealId) {
                // 因为套餐的时候,skuId一样的 所以套餐特别处理,还得套餐id一致
                item.estimatePrice = newData.handPrice || newData.basePrice || newData.commodityPrice
                item.handPrice = newData.handPrice
              } else if (!item.setMealId) {
                item.estimatePrice = newData.handPrice || newData.basePrice || newData.commodityPrice
              }
              item.saleTotalAmount = newData.saleTotalAmount
              if (newData.giveList) {
                // 赠送的
                item.giveList = newData.giveList
              }
            }
            if (newData.setMealList) {
              // 套餐的
              item.childCommodityList = newData.setMealList
            }

            item.memberDiscountAmount = newData.memberDiscountAmount
            // eslint-disable-next-line no-param-reassign
            // item = { ...item };
          })
        })
      })
    }
    console.log(cardMessageDesc, 'cardMessageDesc')
    setShopMessageStore({
      ...cardMessageDesc,
    })
    setCardMessage({
      ...cardMessageDesc,
    })
    if (!cbgActivityId) {
      setTimeout(() => {
        setShouldGetCoupon(shouldGetCoupon + 1)
      }, 500)
    }
    // return '';
  }
  /**
   * 优惠卷选择确定
   * @param selectCouponDesc 选中优惠卷
   */
  const fnDetermineCallCouponBlack = (selectCouponDesc: any) => {
    setSelectCoupon(selectCouponDesc)
    setSelectIntegral([])
    setShowCouponLayer(false)
  }

  /**
   * 积分卷选择确定
   * @param selectIntegralDesc 选中积分卷
   */
  const fnDetermineCallUntegralBlack = (selectIntegralDesc: any) => {
    setSelectIntegral(selectIntegralDesc)
    setShowIntegralLayer(false)
  }
  /**
   * 获取优惠券列表
   */
  const fnGetCouponList = () => {
    if (couponList.length !== 0) {
      return
    }
    const params = {
      shopId: shopAndSite?.id,
      // 订单来源商城Id
      goodsList: skuIdListObj,
      orderAmount: couponPrice,
    }
    postMarketingMobileCouponListByOrder(params).then((res) => {
      if (res.code === 1000) {
        // setSelectCoupon
        const selectCouponDesc: any = []
        res.data.forEach((item: any) => {
          item.onlyId = `${item.belongType}${item.id}` // 因为优惠券的id不是唯一性的,所以加上个唯一的
          if (item.select) {
            // 商品优惠券默认要添加选中的商品skuId
            if (item.type === 5) {
              const skuIdList: number[] = []
              for (const child of skuIdListObj) {
                skuIdList.push(...(child.skuIdList || []))
              }
              if (skuIdList.length > 0) {
                for (const skuId of skuIdList) {
                  if (item.suitableSkuIdList.includes(skuId)) {
                    item.selectSkuId = skuId
                    break
                  }
                }
              }
            }
            selectCouponDesc.push(item)
          }
        })
        setCouponList(res.data)
        setSelectCoupon(selectCouponDesc)
      }
    })
  }
  useLayoutEffect(() => {
    setTimeout(() => {
      createSelectorQuery()
        .select('#confirm_topbar')
        .boundingClientRect()
        .exec((res) => {
          if (res[0]) {
            const _topbarHeight = res[0].height
            createSelectorQuery()
              .select('#bottom')
              .boundingClientRect()
              .exec((resTabs) => {
                if (resTabs[0]) {
                  const _resTabsHeight = resTabs[0].height
                  const _windowHeight = getSystemInfoSync().windowHeight
                  const _scrollviewHeight = _windowHeight - _topbarHeight - _resTabsHeight
                  setScrollViewHeight(_scrollviewHeight)
                }
              })
          }
        })
    })
  })
  // 自提判断
  const fnGetAddress = async () => {
    const params: any = {
      id: sendAddress,
    }
    const res: any = await getLogisticsShipperAddressGet(params)
    if (res.data.provinceCode !== addressInfo.provinceCode) {
      setLogisticsType(false)
    }
    if (res.data.cityCode !== addressInfo.cityCode) {
      setLogisticsType(false)
    } else if (res.data.districtCode !== addressInfo.districtCode) {
      setLogisticsType(false)
    } else {
      setLogisticsType(true)
    }
  }
  useEffect(() => {
    if (!isEmpty(cardMessage)) {
      if (addressInfo) {
        fnGetFreight()
      }
      if (deliveryType) {
        // 判断自提
        if (deliveryType && sendAddress && Object.keys(SelectItem).length <= 0) {
          fnGetAddress()
          return
        }
        if (Object.keys(SelectItem).length > 0 && deliveryType && SelectItem.logisticsMessage) {
          if (SelectItem.logisticsMessage.provinceCode !== addressInfo.provinceCode) {
            setLogisticsType(false)
            return
          }
          if (SelectItem.logisticsMessage.provinceCode !== addressInfo.cityCode) {
            setLogisticsType(false)
            return
          }
          if (SelectItem.logisticsMessage.provinceCode !== addressInfo.districtCode) {
            setLogisticsType(false)
            return
          }
          if (SelectItem.logisticsMessage.provinceCode === addressInfo.provinceCode) {
            setLogisticsType(true)
          }
        }
      } else {
        // 判断物流是不是在配送范围的
        if (areaList.length > 0 && addressInfo) {
          let limitWay = 1
          for (const key of Object.keys(cardMessage)) {
            limitWay = cardMessage[key][0]?.limitWay
            break
          }
          let flag = isDeliverable(allArea, areaList, limitWay, addressInfo)
          setLogisticsType(flag)
        } else if (allArea) {
          setLogisticsType(true)
        } else {
          setLogisticsType(false)
        }
      }
    }
  }, [addressInfo, cardMessage])
  useEffect(() => {
    if (shouldGetCoupon > 0) {
      fnGetCouponList() // 优惠券列表
    }
  }, [shouldGetCoupon])
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'confirmOrder_navigationBarTitleText' }) })
    getSignatures()
    if (cbgActivityId && [2, 3].includes(deliveryTypeStore)) {
      fnGetAddressList(2)
    }
    if (!cbgActivityId || [1, 3].includes(deliveryTypeStore)) {
      fnGetAddressList(0)
    }
    switch (deliveryTypeStore) {
      case 1:
        setDeliveryType(false)
        break
      case 2:
        setDeliveryType(true)
        break
      default:
        setDeliveryType(defaultDeliveryType ? defaultDeliveryType === '2' : true)
    }
    fnGetAllType()
    setNewPayType({})
  }, [])
  useDidShow(() => {
    fnInitEstimate()
  })

  /**
   * @returns 返回详细地址
   */
  const fnGetFullAdd = () => {
    if (!addressInfo) {
      return ''
    }
    return combinationAddress([
      addressInfo?.provinceName,
      addressInfo?.cityName,
      addressInfo?.districtName,
      addressInfo?.streetName,
      addressInfo?.address,
    ])
  }
  const fnAddressRender = () => {
    if (cbgActivityId && deliveryType) {
      const {
        pickupPointName,
        pickupPointProvince,
        pickupPointCity,
        pickupPointArea,
        pickupPointStreet,
        pickupPointAddress,
      } = orderstore
      let pickupInfoStr
      if (selfPickupInfo) {
        const { name, phone } = selfPickupInfo
        pickupInfoStr = `${name} ${phone.substr(0, 3)} ${phone.substr(3, 4)} ${phone.substr(7, 4)}`
      } else {
        pickupInfoStr = intl.formatMessage({
          id: 'order.confirmOrder.qingxuanzetihuoren',
          defaultMessage: '请选择提货人',
        })
      }
      return (
        <View
          className={styles['self-pickup']}
          onClick={() => {
            Router.navigateTo(
              !selfPickupInfo && !hasOtherSelfPickupInfo ? 'basicSetting/addressAdd' : 'basicSetting/addressList',
              {
                active: '2',
                handleSelectAddress: '',
              },
            )
          }}
        >
          <View className={styles['self-pickup-item']}>
            <View className={styles['self-pickup-item-label']}>
              {intl.formatMessage({ id: 'order.confirmOrder.tihuoren', defaultMessage: '提货人' })}：
            </View>
            <View className={cs(styles['self-pickup-item-value'], selfPickupInfo && styles['empty'])}>
              {pickupInfoStr}
            </View>
            <Icons name="ChevronRight" size={16} color="#C8CACD" />
          </View>
          <View className={styles['self-pickup-item']}>
            <View className={styles['self-pickup-item-label']}>
              {intl.formatMessage({ id: 'order.confirmOrder.tihuodian', defaultMessage: '提货点' })}：
            </View>
            <View className={styles['self-pickup-item-value']}>{pickupPointName}</View>
          </View>
          <View className={styles['self-pickup-desc']}>
            {pickupPointProvince || ''}
            {pickupPointCity || ''}
            {pickupPointArea || ''}
            {pickupPointAddress}
          </View>
        </View>
      )
    }
    let shouldShow = false
    Object.keys(cardMessage).forEach((key) => {
      cardMessage[key].forEach((item: any) => {
        if (item.logistics?.deliveryType !== 3) {
          shouldShow = true
        }
      })
    })
    if (!shouldShow) {
      return <View />
    }
    return (
      <Address
        addressInfo={{
          ...addressInfo,
          ...{
            fullAddress: fnGetFullAdd(),
          },
        }}
        hasOtherAddress={hasOtherRecieveAddress}
      />
    )
  }

  /**
   * @returns 商品列表
   */
  const fnCommodityRender = () => {
    if (cbgActivityId) {
      let list: any[] = []
      Object.keys(cardMessage).map((key: any) => {
        list.push(
          ...cardMessage[key].map((item) => {
            return item
          }),
        )
      })
      return (
        <View className={styles['commodity-list']}>
          {list.map((item: any, index: number) => (
            <View className={styles['commodity-item']} key={index}>
              <Image src={item.commodityLogo} className={styles['commodity-item-img']} />
              <View className={styles['commodity-item-content']}>
                <Text className={styles['content-title']}>{item.name}</Text>
                <Text className={styles['content-type']}>{fnGetSku(item.commoditySku)}</Text>
                <View className={styles['price-warp']}>
                  <View className={styles['price-left']}>
                    <Text className={styles['icon-tips-size']}>{intl.formatMessage({ id: 'currency' })}</Text>
                    <Text className={styles['money-size']}>{fnGetPriceSection(fnGetNewEstimatePrice(item), 0)}</Text>
                    <Text className={styles['icon-tips-size']}>
                      {`.${fnGetPriceSection(fnGetNewEstimatePrice(item), 1)}`}
                    </Text>
                    <Text className={styles['money-uni']}>{` / ${item.unitName}`}</Text>
                  </View>
                  <Text>{`X${item.count}`}</Text>
                </View>
              </View>
            </View>
          ))}
          <View
            className={styles['delivery-type']}
            onClick={() => {
              if (deliveryTypeStore === 3) {
                setVisibleDeliveryType(true)
              }
            }}
          >
            <View className={styles['delivery-type-label']}>
              {intl.formatMessage({
                id: 'order.confirmOrder.peisong',
                defaultMessage: '配送',
              })}
            </View>
            <View className={styles['delivery-type-value']}>
              {deliveryType
                ? intl.formatMessage({
                    id: 'order.confirmOrder.ziti',
                    defaultMessage: '自提',
                  })
                : intl.formatMessage({
                    id: 'order.confirmOrder.wuliu',
                    defaultMessage: '物流',
                  })}
            </View>
            <Icons name="ChevronRight" size={16} color="#C0C4CC" />
          </View>
        </View>
      )
    }
    return (
      <>
        {Object.keys(cardMessage).map((key: any, index: number) => {
          if (cardMessage[key].length === 0) {
            return
          }
          // eslint-disable-next-line consistent-return
          return (
            // <View key={`commodutycard${index}`} style={styles.width100}>
            <CommodutyCard
              key={`commodutycard${index}`}
              fnCloseLoginsticsLayer={fnCloseLoginsticsLayer}
              fnCloseTimeLayer={fnCloseTimeLayer}
              fnShowCommodity={fnCloseCommodityList}
              thisShop={cardMessage[key]}
              selectItem={SelectItem}
              getvendorMember={getVendorMember}
              freightTotal={freightTotal}
            />
            // </View>
          )
        })}
      </>
    )
  }
  /**
   * 选择送货时间
   * @param selectData 选择的时间日期
   */
  const fnDeliveryTimeCallBlack = (selectData: any) => {
    let keyName = `shopId_${newShop.memberId}`
    const cardMessageDesc = {
      ...cardMessage,
    }
    if (!newShop.memberId) {
      // 多商品的时候 需要取第一个
      keyName = `shopId_${newShop[0].memberId}`
      cardMessageDesc[keyName].forEach((item: any) => {
        if (item.id === newShop[0].id && item.logistics?.deliveryType === newShop[0].logistics?.deliveryType) {
          // eslint-disable-next-line no-param-reassign
          item.delivery = selectData
        }
      })
    } else {
      cardMessageDesc[keyName].forEach((item: any) => {
        if (item.id === newShop.id) {
          // eslint-disable-next-line no-param-reassign
          item.delivery = selectData
        }
      })
    }
    fnCloseTimeLayer()
    setShopMessageStore({
      ...cardMessageDesc,
    })
    setCardMessage({
      ...cardMessageDesc,
    })
  }

  /**
   *  获取组件的 供应id
   * */
  const getVendorMember = (data: any) => {
    setVendorMember({
      ...data,
    })
  }
  /**
   * 回调配送方式
   * @returns Index 1 是 自提 而是 0是物流运输
   * */
  const onSelectLogistics = (data: any) => {
    const _shopMessageStore = {
      ...shopMessageStore,
    }
    const _goalShop = _shopMessageStore[`shopId_${logisticsLayer.memberId}`]
    const _goalSKu = _goalShop.map((item) => {
      const _item = {
        ...item,
      }
      if (data.Index === 1) {
        _item.deliveryType = DELIVERY_TYPE_ENUM.SELF_PICKUP
        _item.addressId = data.logisticsMessage.id
        _item.phone = data.logisticsMessage.phone
        _item.address = data.logisticsMessage.fullAddress
        _item.receiver = data.logisticsMessage.receiverName
      } else {
        _item.deliveryType = DELIVERY_TYPE_ENUM.LOGISTICS
        _item.logisticsTemplateId = item.logistics?.templateId
        _item.freightType = item.logistics?.carriageType
        _item.weight = `${item.logistics?.weight}`
      }
      return {
        ..._item,
      }
    })
    setShopMessageStore(
      Object.assign(
        {
          ..._shopMessageStore,
        },
        {
          [`shopId_${logisticsLayer.memberId}`]: _goalSKu,
        },
      ),
    )
    setSelectItem({
      ...data,
    })

    // 自提
    if (logisticsLayer?.logistics?.deliveryType === 2 || data.Index === 1) {
      setLogisticsType(true)
      return
    }
    if (areaList.length > 0 && addressInfo) {
      let flag = true
      if (allArea) {
        setLogisticsType(flag)
      } else {
        let limitWay = 1
        for (const key of Object.keys(_shopMessageStore)) {
          limitWay = _shopMessageStore[key][0]?.limitWay
          break
        }
        let flag = isDeliverable(allArea, areaList, limitWay, addressInfo)
        if (!flag) {
          Toast.show({
            title: translate('mobile.resource.order.gaidiqubuzhichi_tip', {
              name: logisticsLayer.name,
            }),
            icon: 'none',
          })
        }
        setLogisticsType(flag)
      }
    } else if (allArea) {
      setLogisticsType(true)
    }
  }
  const contractConfirm = () => {
    Router.redirectTo('contract/signatureAuth')
    setIsOpenedContract(false)
  }
  return (
    <View className={styles['page']}>
      <View id="confirm_topbar">
        <GlobalHeader
          title={
            <Text>
              {intl.formatMessage({
                id: 'confirmOrder_title',
              })}
            </Text>
          }
          back={handleGoBack}
          // customRenderLeft={<Icons name='ChevronLeft' onClick={handleGoBack} />}
        />
      </View>
      <ScrollView
        className={styles['scroll-view']}
        style={{
          flex: 1,
          height: scrollViewHeight,
        }}
      >
        <View
          style={{
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          {fnAddressRender()}
          {fnCommodityRender()}
          <View className={styles['content-warp']}>
            {payTypeMessage?.hasContract && (
              <View className={styles['content-item']}>
                <View>
                  <Text className={styles['content-text']}>{translate('mobile.resource.order.contract')}</Text>
                </View>
                <View>
                  <Radio.Group value={orderContractType} onChange={(value) => switchContract(value)}>
                    {CONTRACT_TYPES.map((item) => (
                      <View
                        key={item.value}
                        style={{
                          display: 'flex',
                        }}
                      >
                        <Radio value={item.value} size={18}>
                          <View
                            className={styles['content-text']}
                            style={{
                              margin: '0 6px',
                            }}
                          >
                            {item.label}
                          </View>
                        </Radio>
                      </View>
                    ))}
                  </Radio.Group>
                </View>
              </View>
            )}
            {/* { <View */}
            {
              <View
                className={styles['content-item']}
                onClick={() => {
                  handleJump('basicSetting/invoiceList')
                }}
              >
                <View onClick={fnGetFreight}>
                  <Text className={styles['content-text']}>
                    {intl.formatMessage({
                      id: 'confirmOrder_contentText_1',
                    })}
                  </Text>
                </View>
                <View>
                  <Text className={styles['content-text-select']}>
                    {(invoiceInfo && invoiceInfo.invoiceTitle) ||
                      intl.formatMessage({
                        id: 'confirmOrder_contentTextSelect_1',
                      })}
                  </Text>
                  <Icons name="ChevronRight" size={16} color={THEME_COLORS.textSecondary} />
                </View>
              </View>
            }
            {!isInquireOrder && !cbgActivityId && (
              <View
                className={styles['content-item']}
                onClick={() => {
                  setShowCouponLayer(true)
                }}
              >
                <View>
                  <Text className={styles['content-text']}>
                    {intl.formatMessage({
                      id: 'confirmOrder_contentText_2',
                    })}
                  </Text>
                </View>
                <View style={styles.alignItems}>
                  <Text className={styles['content-text-select']}>
                    {fnGetselectCouponMoney(selectCoupon) === '0.00'
                      ? intl.formatMessage({
                          id: 'confirmOrder_contentTextSelect_2_1',
                        })
                      : intl.formatMessage({
                          id: 'confirmOrder_contentTextSelect_2_2',
                          currency: intl.formatMessage({
                            id: 'currency',
                          }),
                          data: fnGetselectCouponMoney(selectCoupon),
                        })}
                  </Text>
                  <Icons name="ChevronRight" size={16} color={THEME_COLORS.textSecondary} />
                </View>
              </View>
            )}
            {/* !isInquireOrder && !cbgActivityId && (
              <View
                className={styles['content-item']}
                onClick={() => {
                  setShowIntegralLayer(true)
                }}
              >
                <View>
                  <Text className={styles['content-text']}>{translate('mobile.resource.order.jifendikou')}</Text>
                </View>
                <View style={styles.alignItems}>
                  <Text className={styles['content-text-select']}>
                    {fnGetselectIntegralMoney(selectIntegral) === '0.00'
                      ? intl.formatMessage({
                          id: 'confirmOrder_contentTextSelect_2_1',
                        })
                      : intl.formatMessage({
                          id: 'confirmOrder_contentTextSelect_2_2',
                          currency: intl.formatMessage({
                            id: 'currency',
                          }),
                          data: fnGetselectIntegralMoney(selectIntegral),
                        })}
                  </Text>
                  <Icons name="ChevronRight" size={16} color={THEME_COLORS.textSecondary} />
                </View>
              </View>
            )} */}
            {payTypeMessage?.required && (
              <View
                className={styles['content-item']}
                onClick={() => {
                  setShowPayType(true)
                }}
              >
                <View>
                  <Text className={styles['content-text']}>
                    {intl.formatMessage({
                      id: 'confirmOrder_contentText_3',
                    })}
                  </Text>
                </View>
                <View>
                  <Text className={styles['content-text-select']}>
                    {(newPayType && newPayType.payChannelName) ||
                      intl.formatMessage({
                        id: 'confirmOrder_contentTextSelect_3',
                      })}
                  </Text>
                  <Icons name="ChevronRight" size={16} color={THEME_COLORS.textSecondary} />
                </View>
              </View>
            )}
          </View>
          <View className={`${styles['content-warp']} ${styles['margin-top12']}`}>
            <Cell
              title={intl.formatMessage({
                id: 'confirmOrder_contentTextSelect_4',
                defaultMessage: '商品金额',
              })}
              value={`+ ${intl.formatMessage({
                id: 'currency',
              })}${newPrice}`}
            />
            {/* 税费 */}
            {isCrossBorder && (
              <Cell
                title={intl.formatMessage({
                  id: 'commodityMerge.stocksSourcing.components.taxes.label',
                  defaultMessage: '税费',
                })}
                value={`+ ${intl.formatMessage({
                  id: 'currency',
                })}${taxation}`}
              />
            )}
            {(!cbgActivityId || !deliveryType) && (
              <Cell
                title={intl.formatMessage({
                  id: 'confirmOrder_contentTextSelect_5',
                  defaultMessage: '运费',
                })}
                value={`+ ${intl.formatMessage({
                  id: 'currency',
                })}${fnKeepTwo(needFreight ? freightTotal : 0)}`}
              />
            )}
            {!cbgActivityId && (
              <>
                <Cell
                  title={intl.formatMessage({
                    id: 'confirmOrder_contentTextSelect_6',
                    defaultMessage: '折扣金额',
                  })}
                  value={`- ${intl.formatMessage({
                    id: 'currency',
                  })}${fnGetPromotionAmount(shopMessageStore)}`}
                />
                <Cell
                  title={translate('mobile.common.huiyuanzhekoujine')}
                  value={`- ${intl.formatMessage({
                    id: 'currency',
                  })}${fnGetMemberDisCountAmount(shopMessageStore)}`}
                />
                <Cell
                  title={intl.formatMessage({
                    id: 'confirmOrder_contentTextSelect_8',
                    defaultMessage: '促销活动',
                  })}
                  value={`- ${intl.formatMessage({
                    id: 'currency',
                  })}${fnGetCgbAmount(shopMessageStore)}`}
                />
                {!isInquireOrder && (
                  <>
                    <Cell
                      title={intl.formatMessage({
                        id: 'deduction_amount_of_points',
                        defaultMessage: '积分抵扣金额',
                      })}
                      value={`- ${intl.formatMessage({
                        id: 'currency',
                      })}${fnGetselectIntegralMoney(selectIntegral)}`}
                    />
                    <Cell
                      title={intl.formatMessage({
                        id: 'confirmOrder_contentTextSelect_7',
                        defaultMessage: '优惠券',
                      })}
                      value={`- ${intl.formatMessage({
                        id: 'currency',
                      })}${fnGetselectCouponMoney(selectCoupon)}`}
                    />
                  </>
                )}
              </>
            )}
            {payTypeMessage && payTypeMessage.payNodes && payTypeMessage.payNodes.length >= 1 && (
              <View className={styles['remarks-warp']}>
                <Text className={styles['remarks-tips']}>{fnGetRemarks(payTypeMessage.payNodes)}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              height: pxTransform(68),
            }}
          />
        </View>
      </ScrollView>
      <FooterBtn
        id="bottom"
        cbgActivityId={Number(cbgActivityId)}
        deliveryType={deliveryType}
        freightTotal={freightTotal}
        allPrice={fnGetAllPrice()}
        payTypeMessage={payTypeMessage}
        fnFullScreenLoading={fnFullScreenLoading}
        selectCoupon={selectCoupon}
        selectIntegral={selectIntegral}
        selectItem={SelectItem}
        logisticsType={logisticsType}
        taxation={isCrossBorder ? taxation : 0}
        orderContractType={payTypeMessage?.hasContract ? orderContractType : undefined}
        askPurchaseQuoteId={askPurchaseQuoteId}
      />
      {/* 商品列表 */}
      <CommodityList selectShop={selectShop} showCommodityList={showCommodityList} fnClose={fnCloseCommodityList} />
      {/* 物流运费 */}
      <LogisticsLayer
        logisticsLayer={logisticsLayer}
        addressInfo={addressInfo}
        freightTotal={freightTotal}
        showLogisticsLayer={showLogisticsLayer}
        fnClose={fnCloseLoginsticsLayer}
        onSelect={onSelectLogistics}
        vendorMember={vendorMember}
        SelectItem={SelectItem}
      />
      {/* 优惠券 */}
      <CouponLayer
        shopMessageStore={cardMessage}
        showCouponLayer={showCouponLayer}
        fnClose={fnCloseCouponLayer}
        couponList={couponList}
        selectCoupon={selectCoupon}
        fnDetermineCallCouponBlack={fnDetermineCallCouponBlack}
      />
      {/* 积分抵扣 */}
      <IntegralLayer
        shopMessageStore={cardMessage}
        showIntegralLayer={showIntegralLayer}
        fnClose={() => {
          setShowIntegralLayer(false)
        }}
        selectCoupon={selectCoupon}
        fnDetermineCallCouponBlack={fnDetermineCallUntegralBlack}
        allPrice={fnGetAllPrice(false)}
      />
      <FullScreenLoading />
      {/* 支付类型 */}
      <PayType
        payTypeList={payTypeMessage?.payTypes || []}
        showPayType={showPayType}
        fnClose={() => {
          fnClosePayType()
        }}
        fnDetermineProps={fnDeterminePayType}
        orderInfo={shopMessageStore}
        selectPayType={newPayType}
      />
      {/* 送货时间 */}
      <DeliveryTime
        newRanTime={newRanTime}
        showTimeLayer={showTimeLayer}
        fnClose={fnCloseTimeLayer}
        callBlackFn={fnDeliveryTimeCallBlack}
      />
      <Modal
        title={translate('mobile.resource.order.ninweiyourenzhengchenggongdedianziqz')}
        isOpened={isOpenedContract}
        onConfirm={contractConfirm}
        onClose={() => setIsOpenedContract(false)}
        onCancel={() => setIsOpenedContract(false)}
        cancelText={translate('mobile.resource.order.shiyongzhizhihetong')}
        confirmText={translate('mobile.resource.order.qurenzheng')}
        className={styles['account-model']}
      />
      <DeliveryTypePopup
        visible={visibleDeliveryType}
        defaultValue={deliveryType ? 2 : 1}
        deliveryType={deliveryTypeStore}
        onClose={() => {
          setVisibleDeliveryType(false)
        }}
        onConfirm={(value) => {
          setVisibleDeliveryType(false)
          setDeliveryType(value === 2)
        }}
      />
    </View>
  )
}
export default GlobalWrapper(observer(ConfirmOrder))
