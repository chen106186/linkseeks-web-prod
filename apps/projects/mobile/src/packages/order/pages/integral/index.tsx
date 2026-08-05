import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, Icons, Image, Toast } from '@apps/mobile-ui'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import MellowCard from '@/components/MellowCard'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { useDidShow, getCurrentInstance, showLoading, hideLoading, showModal } from '@apps/mobile-services/utils/taro'
import Label from '@/components/Label'
import Router from '@/utils/router'
import { numFormat } from '@/utils/numberFormat'
import useStores from '@/store/useStores'
import { encryptedByAES } from '@linkseeks/crypto'
import { useIntl } from '@linkseeks/i18n'
import { ENVIRONMENT } from '@/constants'
import NavBar from '@/components/NavBar'
import {
  getLogisticsMobileReceiverAddressListDefault,
  getLogisticsMobileShipperAddressGet,
  getLogisticsShipperAddressGet,
  GetLogisticsMobileReceiverAddressPageResponseDetail,
  GetLogisticsShipperAddressGetResponse,
} from '@apps/apis'
import { postOrderCreateBuyerPay, postOrderMobileCreatePoints, PostOrderMobileCreatePointsResponse } from '@apps/apis'
import { getMemberMobileSecurityGet } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import Product from './components/Product'
import SubmitBtn from './components/SubmitBtn'
import { THEME_COLORS } from '@/constants/theme'
import useFormatProduct, { OrderDataType } from './hooks/useFormatProduct'
import useGetPoint from './hooks/useGetPoint'
import PayPopupInput from './components/PaypopupInput'
import LogisticsLayer from '../confirmOrder/components/logisticsLayer'
import Address from '../confirmOrder/components/address'
import { getStockStorage } from './utils'
import styles from './index.module.scss'
import { combinationAddress } from '@/utils/dataMerge'
export type AddressType = GetLogisticsMobileReceiverAddressPageResponseDetail & {
  /** 省区编码 */
  provinceCode: string
  /** 区编码 */
  cityCode: string
  /** 市编码 */
  districtCode: string
}

/** 确认订单， 积分订单 */
const ConfrimIntegralOrder = () => {
  const tempData = useMemo(() => getCurrentInstance().preloadData, [])
  const {
    userStore: { shopAndSite, userInfo, setAddressItem },
    confirmOrderStore: { addressInfo, setAddressInfo },
  } = useStores()
  /** 订单信息以及 是否设置支付密码 */
  const { orderInfo } = useFormatProduct({
    orderData: tempData!.orderData,
  } as any)
  /** 自提信息 */
  const [selfPickInfo, setSelfPickInfo] = useState<null | GetLogisticsShipperAddressGetResponse>(null)
  /** 积分 */
  const { point } = useGetPoint({
    memberId: orderInfo.supplyMembersId,
    memberRoleId: orderInfo.supplyMembersRoleId,
  })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  /** 密码输入框visible */
  const [visible, setVisible] = useState<boolean>(false)
  /** 创建积分订单后的后端返回的信息， 用于支付 */
  const [afterSubmitReturnInfo, setAfterSubmitReturnInfo] = useState<PostOrderMobileCreatePointsResponse | null>(null)
  /** 支付方式 */
  const [payMethod, setPayMethod] = useState<'platformScore' | 'memberScore' | null>(null)
  const showAddressDeliveryType = [DELIVERY_TYPE_ENUM.LOGISTICS, DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF]
  /** 收货地址是否在配送范围内 */
  const [inArea, setInArea] = useState<boolean>(false)
  const [logisticsLayer, setLogisticsLayer] = useState<any>([])
  const [selectItem, setSelectItem] = useState<any>({}) // 选中的自提地址
  const [logisticsType, setlologist] = useState<boolean>(true) // 控制能否点击提交按钮
  const [AreaList, setcommodityAreaList] = useState<any>([]) // 获取配送范围地址
  const [AllArea, setisAllArea] = useState<boolean>(false)
  const [showLogisticsLayer, setShowLogisticsLayer] = useState(false) // 显示物流信息
  const [freightTotal, setFreightTotal] = useState(0)
  const [hasSetRecieveAddress] = useState<boolean>(false)
  const intl = useIntl()

  /**
   * 获取收获地址
   */
  const fnGetAddressList = () => {
    const obj = {
      current: '1',
      pageSize: '10',
    }
    getLogisticsMobileReceiverAddressListDefault(obj).then(async (res) => {
      if (res.code === 1000) {
        setAddressInfo(null)
        const stockHistory = await getStockStorage()
        if (stockHistory && stockHistory.type === 'address') {
          const stockAddress: any = stockHistory.data
          res.data.forEach((item: any) => {
            stockHistory.data
            if (item.id === stockAddress.id) {
              setAddressInfo(item)
            }
          })
          setAddressInfo(stockHistory.data)
        } else {
          res.data.forEach((item: any) => {
            if (item.isDefault) {
              setAddressInfo(item)
            }
          })
        }
      }
    })
  }
  useEffect(() => {
    fnGetAddressList()
  }, [])

  // 商城信息
  const pointShopType = useMemo(() => {
    return {
      shopType: 1,
      shopId: shopAndSite?.id,
      shopName: shopAndSite?.name,
    }
  }, [shopAndSite])

  /** 获取商品的自提信息 */
  useEffect(() => {
    if (orderInfo.commodity.deliveryType !== DELIVERY_TYPE_ENUM.SELF_PICKUP) {
      return
    }
    const sendAddressId = orderInfo.commodity.logistics.sendAddressId
    async function getCommodityLogistics() {
      const { code, data, message } = await getLogisticsMobileShipperAddressGet({
        id: sendAddressId.toString(),
      })
      if (code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${code}`,
            defaultMessage: message,
          }),
        })
        return
      }
      setSelfPickInfo(data)
    }
    getCommodityLogistics()
  }, [orderInfo.commodity.deliveryType])

  // 318 控制提交安
  const setlogistics = (item: { isAllArea: boolean; commodityAreaList: any }) => {
    const { isAllArea, commodityAreaList } = item
    if (isAllArea) {
      setisAllArea(isAllArea)
    } else if (commodityAreaList) {
      setcommodityAreaList(commodityAreaList)
    }
  }
  useDidShow(() => {
    setlogistics({
      isAllArea: orderInfo.commodity.isAllArea,
      commodityAreaList: orderInfo.commodity.commodityAreaList,
    })
  })

  /** 购买的商品信息 */
  const commodity = useMemo(() => {
    let data: OrderDataType & {
      commodity: {
        logisticsDetail?: GetLogisticsShipperAddressGetResponse
      }
    } = orderInfo
    if (selfPickInfo !== null) {
      data = {
        ...data,
        commodity: {
          ...orderInfo.commodity,
          logisticsDetail: selfPickInfo,
        },
      }
    }

    /** 处理自营商城, 自营商城的店铺名等 */
    if (shopAndSite?.isSelf) {
      data = {
        ...data,
        storeId: shopAndSite?.id!,
        storePic: shopAndSite?.logoUrl!,
        storeName: shopAndSite?.name!,
      }
    }
    return data
  }, [orderInfo, selfPickInfo, shopAndSite])
  const totalIntegral = useMemo(
    () => orderInfo.commodity.skuItem.count * orderInfo.commodity.skuItem.showPrice,
    [orderInfo],
  )
  const hanldeSelectPayMethod = (fundMode: 'platformScore' | 'memberScore') => {
    const score = point?.[fundMode as 'platformScore' | 'memberScore'] || 0
    const disabled = score < totalIntegral
    if (disabled) {
      return
    }
    setPayMethod(fundMode)
  }

  /** 关闭输入支付密码弹框 */
  const handleClose = (id?: number) => {
    const orderId = id || afterSubmitReturnInfo?.orderIds[0]
    setAddressItem(null)
    Router.redirectTo('order/mycommodityDetails', {
      orderId,
    })
  }
  const handleCodeFinish = async (value: string, reset: () => void) => {
    showLoading()
    const { code, data, message } = await postOrderCreateBuyerPay({
      batchNo: afterSubmitReturnInfo?.batchNo,
      fundMode: payMethod === 'platformScore' ? 1 : 2,
      orderIds: afterSubmitReturnInfo?.orderIds,
      payChannel: afterSubmitReturnInfo?.payChannel,
      payPassword: encryptedByAES(value),
      payType: afterSubmitReturnInfo?.payType,
    } as any)
    hideLoading()
    if (code === 1000) {
      setAddressItem(null)
      Router.redirectTo('order/SubmitSuccess', {
        orderId: afterSubmitReturnInfo?.orderIds[0],
      })
      return
    } else {
      hideLoading()
    }
    Toast.show({
      title: intl.formatMessage({
        id: `${code}`,
        defaultMessage: message,
      }),
    })
    reset()
  }
  const onSubmit = async () => {
    if (submitLoading) {
      return
    }
    if (!logisticsType) {
      Toast.show({
        title: '商品不在配送范围',
      })
      return
    }
    if (payMethod === null) {
      Toast.show({
        title: intl.formatMessage({
          id: 'integral.order.choicePay',
          defaultMessage: '请选择支付方式',
        }),
        icon: 'none',
      })
      return
    }
    const codeRes = await getMemberMobileSecurityGet()
    /** 如果没有设置密码， 重置路由到待支付订单 */
    if (!codeRes.data.hasPayPassword) {
      showModal({
        confirmText: intl.formatMessage({
          id: 'integral.order.confirm',
          defaultMessage: '确认',
        }),
        content: intl.formatMessage({
          id: 'integral.order.noPassword',
          defaultMessage: '您未设置支付密码，是否去设置支付密码',
        }),
        title: intl.formatMessage({
          id: 'integral.order.tips',
          defaultMessage: '提示',
        }),
        cancelText: intl.formatMessage({
          id: 'integral.order.cancel',
          defaultMessage: '取消',
        }),
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            Router.navigateTo('basicSetting/accountSafe')
          }
        },
      })
      return
    }
    setSubmitLoading(true)
    showLoading()
    const invoiceProps = {
      hasInvoice: false,
    }
    /** 收货地址 */
    const consignee = showAddressDeliveryType.includes(orderInfo.commodity.deliveryType)
      ? {
          consignee: {
            consigneeId: addressInfo?.id,
            consignee: addressInfo?.receiverName,
            provinceCode: addressInfo?.provinceCode,
            cityCode: addressInfo?.cityCode,
            districtCode: addressInfo?.districtCode,
            address: addressInfo?.address,
            posttalCode: addressInfo?.postalCode,
            phone: addressInfo?.phone,
            countryCode: '+86',
          },
        }
      : null

    /** 物流信息 */
    const logistics = showAddressDeliveryType.includes(orderInfo.commodity.deliveryType)
      ? {
          weight: orderInfo.commodity.logistics.weight,
          logisticsTemplateId: orderInfo.commodity.logistics.templateId,
        }
      : {
          address:
            (selfPickInfo?.provinceName || '') +
            (selfPickInfo?.cityName || '') +
            (selfPickInfo?.districtName || '') +
            selfPickInfo?.address,
          receiver: userInfo?.userName,
          phone: userInfo?.phone,
        }
    /** 缺少含税， tax, taxRate */
    const postData = {
      vendorMemberId: orderInfo.supplyMembersId,
      vendorRoleId: orderInfo.supplyMembersRoleId,
      vendorMemberName: orderInfo.supplyMembersName,
      ...pointShopType,
      /** 商城环境写死， 4：APP */
      shopEnvironment: ENVIRONMENT,
      ...invoiceProps,
      /** 收货地址信息 */
      ...consignee,
      /** 订单商品 */
      product: {
        productId: orderInfo.commodity.commodityId,
        skuId: orderInfo.commodity.skuItem.skuid,
        name: orderInfo.commodity.commodityName,
        category: orderInfo.commodity.category,
        brand: orderInfo.commodity.brand,
        logo: orderInfo.commodity.commodityLogo,
        /** 商品规格 */
        spec: orderInfo.commodity.skuItem.attributeName,
        price: orderInfo.commodity.skuItem.showPrice,
        quantity: orderInfo.commodity.skuItem.count,
        deliveryType: orderInfo.commodity.deliveryType,
        ...logistics,
        unit: orderInfo.commodity.unit,
      },
    }
    // return;
    const { data, code, message } = await postOrderMobileCreatePoints(postData as any)
    setSubmitLoading(false)
    hideLoading()
    if (code !== 1000) {
      Toast.show({
        title: intl.formatMessage({
          id: `${code}`,
          defaultMessage: message,
        }),
        icon: 'none',
      })
      return
    }
    setAfterSubmitReturnInfo(data)
    setVisible(true)
  }
  const payMethodsList = [
    {
      icon: getOssUrlPath('/Images/platformScore.png'),
      title: intl.formatMessage({
        id: 'integral.order.platformPoint',
        defaultMessage: '平台通用积分',
      }),
      dataIndex: 'platformScore',
    },
    {
      icon: getOssUrlPath('/Images/vipScore.png'),
      title: intl.formatMessage({
        id: 'integral.order.memberPoint',
        defaultMessage: '会员专属积分',
      }),
      dataIndex: 'memberScore',
    },
  ]
  useEffect(() => {
    if (AreaList.length > 0 && addressInfo) {
      let falg = true
      if (AllArea) {
        setlologist(falg)
      } else {
        // eslint-disable-next-line eqeqeq
        const addressList = AreaList.filter((item: any) => item.provinceCode == addressInfo.provinceCode)
        if (addressList.length <= 0) {
          falg = false
        } else {
          // eslint-disable-next-line array-callback-return
          addressList.some((item: any) => {
            if (!item.isAllCity && item.cityCode !== addressInfo.cityCode) {
              falg = false
            } else if (!item.isAllRegion && item.regionCode !== addressInfo.districtCode) {
              falg = false
            }
          })
        }
        setlologist(falg)
      }
    } else if (AllArea) {
      setlologist(true)
    }
  }, [addressInfo, orderInfo])

  /**
   * 回调配送方式
   * @returns Index 1 是 自提 而是 2是物流运输
   * */
  const onSelect = (data: any) => {
    if (AreaList.length > 0 && addressInfo) {
      let falg = true
      if (AllArea) {
        setlologist(falg)
      } else {
        // eslint-disable-next-line eqeqeq
        const addressList = AreaList.filter((item: any) => item.provinceCode == addressInfo.provinceCode)
        if (addressList.length <= 0) {
          falg = false
          Toast.show({
            title: `该地区不支持${logisticsLayer.name}，${logisticsLayer.name}的商品配送`,
          })
        } else {
          // eslint-disable-next-line array-callback-return
          addressList.some((item: any) => {
            if (!item.isAllCity && item.cityCode !== addressInfo.cityCode) {
              falg = false
              Toast.show({
                title: `该地区不支持${logisticsLayer.name}，${logisticsLayer.name}的商品配送`,
              })
            } else if (!item.isAllRegion && item.regionCode !== addressInfo.districtCode) {
              falg = false
              Toast.show({
                title: `该地区不支持${logisticsLayer.name}，${logisticsLayer.name}的商品配送`,
              })
            }
          })
        }
        setlologist(falg)
      }
    } else if (AllArea) {
      setlologist(true)
    }
    setSelectItem({
      ...data,
    })
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
   * @returns 返回详细地址
   */
  const fnGetFullAdd = () => {
    if (!addressInfo) {
      return ''
    }
    const fullAddress = combinationAddress([
      addressInfo?.provinceName,
      addressInfo?.cityName,
      addressInfo?.districtName,
      addressInfo?.streetName,
      addressInfo?.address,
    ])
    return fullAddress
  }
  const fnShouldShowAddress = () => {
    let shouldShow = false
    const { logistics } = orderInfo.commodity
    if (logistics.deliveryType !== 3) {
      shouldShow = true
    }
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
        hasOtherAddress={hasSetRecieveAddress}
      />
    )
  }

  /**
   * 显示物流
   * @param thisLogin 当前物流
   */
  const fnShowLogin = (thisLogin: any) => {
    if (thisLogin.logistics.deliveryType === DELIVERY_TYPE_ENUM.NO_DELIVERY) {
      return
    }
    fnCloseLoginsticsLayer(thisLogin)
  }
  const fnGetLogistics = (key: any, _logisticsLayer: any) => {
    const logisticsArr = [
      '',
      intl.formatMessage({
        id: 'order.wuliuyunshu',
        defaultMessage: '物流运输',
      }),
      intl.formatMessage({
        id: 'order.shangmenzitimianyun',
        defaultMessage: '上门自提 免运费',
      }),
      intl.formatMessage({
        id: 'order.wuxupeisong',
        defaultMessage: '无需配送',
      }),
      '请选择配送方式',
    ]
    if (key === 4) {
      if (selectItem.Index === 0 || Object.keys(selectItem).length <= 0) {
        return intl.formatMessage({
          id: 'order.wuliuyunshu',
          defaultMessage: '物流运输',
        })
      }
      return intl.formatMessage({
        id: 'order.shangmenzitimianyun',
        defaultMessage: '上门自提 免运费',
      })
    }
    if (key === 2) {
      const parmas = {
        id: _logisticsLayer.logistics.sendAddressId,
      }
      getLogisticsShipperAddressGet(parmas).then((res: any) => {
        // eslint-disable-next-line no-param-reassign
        _logisticsLayer.logistics.addMessage = res.data
      })
    }
    return (
      logisticsArr[key] ||
      intl.formatMessage({
        id: 'confirmOrder_components_commodutyCard_fnGetLogistics_logisticsArr_0',
      })
    )
  }
  return (
    <View className={styles.page}>
      <NavBar
        title={intl.formatMessage({
          id: 'integral.order.confirmOrder',
          defaultMessage: '确认订单',
        })}
      />
      {!logisticsType && (
        <View className={styles.errorTip}>
          <Text className={styles.errorTip_text}>
            {intl.formatMessage({
              id: 'integral.order.address.noMatch.errorText',
              defaultMessage: '选择的地区暂不支持 {{name}} 的商品配送！',
              name: orderInfo.commodity.commodityName,
            })}
          </Text>
        </View>
      )}
      <ScrollView className={styles.scrollView}>
        {fnShouldShowAddress()}
        <Product {...commodity} />
        <View className={styles['logistics-warp']}>
          <Text className={styles['left-titlr']}>
            {intl.formatMessage({
              id: 'confirmOrder_components_commodutyCard_leftTitlr_1',
            })}
          </Text>
          <View
            className={styles['logistics-icon']}
            onClick={() => {
              fnShowLogin(orderInfo.commodity)
            }}
          >
            <Text className={styles['small-font']}>
              {fnGetLogistics(orderInfo.commodity.logistics.deliveryType, orderInfo.commodity)}
            </Text>
            <Icons name="ChevronRight" size={16} color="#CCCCCC" />
          </View>
        </View>
        <MellowCard
          className={styles.card}
          title={intl.formatMessage({
            id: 'integral.order.payway',
            defaultMessage: '支付方式',
          })}
          bodyStyle={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <View className={styles['pay-ways']}>
            {payMethodsList.map((_item) => {
              const score = point?.[_item.dataIndex as 'platformScore' | 'memberScore'] || 0
              const disabled = score < totalIntegral
              return (
                <View
                  className={styles['pay-way-item']}
                  key={_item.dataIndex}
                  onClick={() => hanldeSelectPayMethod(_item.dataIndex as 'platformScore')}
                >
                  <Image className={styles['pay-image']} src={_item.icon} />
                  <Text className={styles['pay-name']}>{_item.title}</Text>
                  <Text className={styles['score']}>
                    {intl.formatMessage({
                      id: 'integral.order.currentPoint',
                      defaultMessage: '现有积分',
                      point: numFormat(score),
                    })}
                  </Text>
                  <View className={styles['pay-checked']}>
                    {(disabled && (
                      <Label
                        name={intl.formatMessage({
                          id: 'integral.order.insufficient',
                          defaultMessage: '积分不足',
                        })}
                        className={styles['not-enough-label']}
                        textColor="#5C626A"
                      />
                    )) || (
                      <View className={classNames(styles['check-icon'])}>
                        {payMethod === _item.dataIndex && <Icons name="Right" size={14} color={THEME_COLORS.primary} />}
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </MellowCard>
      </ScrollView>
      <PayPopupInput
        scoreValue={intl.formatMessage({
          id: 'integral.order.point',
          defaultMessage: 'n积分',
          point: numFormat(totalIntegral),
        })}
        onCodeFinish={handleCodeFinish}
        popupTitle={intl.formatMessage({
          id: 'integral.order.pointPay',
          defaultMessage: '积分支付',
        })}
        visible={visible}
        onClose={handleClose}
      />
      <SubmitBtn disabled={!logisticsType} score={totalIntegral} onSubmit={onSubmit} />
      {/* 物流运费 */}
      <LogisticsLayer
        logisticsLayer={logisticsLayer}
        addressInfo={addressInfo}
        freightTotal={freightTotal}
        showLogisticsLayer={showLogisticsLayer}
        fnClose={fnCloseLoginsticsLayer}
        onSelect={onSelect}
        vendorMember={{
          vendorMemberId: orderInfo.supplyMembersId,
          vendorRoleId: orderInfo.supplyMembersRoleId,
        }}
        SelectItem={selectItem}
      />
    </View>
  )
}
export default GlobalWrapper(observer(ConfrimIntegralOrder))
