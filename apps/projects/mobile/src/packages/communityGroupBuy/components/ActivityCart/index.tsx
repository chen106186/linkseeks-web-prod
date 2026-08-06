/*
 * @Description: 活动购物车 Popup
 */
import React, { useEffect, useState, useImperativeHandle, useRef } from 'react'
import Router from '@/utils/router'
import cs from 'classnames'
import { View, Text, Icons, Image } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import {
  postProductShopPurchaseSaveOrUpdatePurchase,
  getProductMobileShopPurchaseGetPurchaseList,
  postMarketingMobileCbgActivityGoodsCheckQuantity,
  postMarketingMobileCbgActivityPriceCalculate,
  postProductShopPurchaseDeletePurchase,
} from '@apps/apis'
import { useRouter, pxTransform, showToast, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import { priceFormat } from '@/utils/numberFormat'
import { THEME_COLORS } from '@/constants/theme'
import { fnGetPriceAndAction } from '../../commonlyFn'
import useStores from '@/store/useStores'
import Popup from '@/components/Popup'
import styles from './index.module.scss'
import EmptyLayout from '@/components/Empty/index'
import Item from './item'

const CheckedIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/Checked-@2x.png'
const DefaultIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/Default@2x.png'

export interface ActivityCartStatType {
  totalCount: number
  totalPrice: number
  discount: number
  priceArr: string[]
}

type RouteParams = {
  upperMemberId: string
  upperRoleId: string
}

interface IProps {
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 活动ID
   */
  activityId: number | string
  /**
   * 配送方式
   */
  deliveryType: number
  /**
   * 自提点
   */
  pickupPoint: any
  /**
   * 活动库存
   */
  activityStockMap?: any
  /**
   * 统计更新触发事件
   */
  onUpdateStat?: (ActivityCartStatType) => void
  /**
   * 关闭触发事件
   */
  onClose?: () => void
}

export type ActivityCartRefHandle = {
  /**
   * 刷新
   */
  refresh: () => void
  /**
   * 添加商品
   */
  addProduct: (skuId: number, count: number, commodityId: number, isAdd: boolean) => Promise<any>
  /**
   * 去结算
   */
  confirmOrder: () => void
}

const ActivityCart = React.forwardRef<ActivityCartRefHandle, IProps>((props: IProps, ref) => {
  const { visible, activityId, deliveryType, pickupPoint, activityStockMap, onClose, onUpdateStat } = props
  const intl = useIntl()
  const skuIdsRef = useRef<number[]>([])
  const {
    groupBuyStore: { getCartSelectedSkuIds, setCartSelectedSkuIdsMap },
    purchaseOrderStore: { setShopMessageStore },
    confirmOrderStore: { setstoreItem, setSelfPickupInfo, setDeliveryType: setDeliveryTypeStore },
    userStore: { shopAndSite },
  } = useStores()
  const {
    params: { upperMemberId, upperRoleId },
  } = useRouter<RouteParams>()
  const { safeBottomHeight } = useSafeArea()

  const refresh = () => {
    skuIdsRef.current = getCartSelectedSkuIds(activityId, pickupPoint?.teamLeaderId)
    getCartList()
  }

  useImperativeHandle(ref, () => ({
    refresh,
    addProduct: checkQuantity,
    confirmOrder,
  }))

  const [cartList, setCartList] = useState<any>([])
  const [priceMap, setPriceMap] = useState<any>({})
  const [selectedAll, setSelectedAll] = useState<boolean>(false)
  const [stat, setStat] = useState<ActivityCartStatType>({
    totalCount: 0,
    totalPrice: 0,
    discount: 0,
    priceArr: [],
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCartList()
  }, [activityId, pickupPoint?.teamLeaderId])

  const getCartList = async () => {
    if (!activityId || !pickupPoint?.teamLeaderId || loading) return
    setLoading(true)
    const res = await getProductMobileShopPurchaseGetPurchaseList({
      cbgActivityId: String(activityId),
      cbgTeamLeaderId: pickupPoint?.teamLeaderId,
    })
    if (res.code === 1000) {
      let list1: any[] = []
      let list2: any[] = []
      res.data.forEach((item) => {
        if (item.isPublish && item.stockCount > 0) {
          item.selectable = true
          list1.push(item)
        } else {
          item.selectable = false
          list2.push(item)
        }
      })
      setCartList([...list1, ...list2])
      if (skuIdsRef.current.length > 0) {
        let skuIds: number[] = []
        list1.forEach((item) => {
          skuIds.push(item.purchaseSkuResp.id)
        })
        skuIdsRef.current = skuIdsRef.current.filter((id) => skuIds.includes(id))
      } else {
        skuIdsRef.current = list1.map((item) => item.purchaseSkuResp.id)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    let newSkus: any[] = []
    cartList?.forEach((item) => {
      let skuId = item.purchaseSkuResp.id
      if (!priceMap[skuId] && skuIdsRef.current.includes(skuId)) {
        newSkus.push(item)
      }
    })
    calcCartPrice(newSkus)
  }, [cartList])

  useEffect(() => {
    updateStat()
  }, [cartList, priceMap])

  const updateStat = () => {
    let totalCount = 0
    let totalPrice = 0
    let discount = 0
    let _selectedAll = true
    cartList?.forEach((item) => {
      let skuId = item.purchaseSkuResp.id
      if (skuIdsRef.current.includes(skuId)) {
        let priceConfig = priceMap[skuId] || {}
        totalPrice += item.count * (priceConfig.handPrice || priceConfig.commodityPrice || 0)
        totalCount += item.count
        if (priceConfig.handPrice) {
          discount += item.count * (priceConfig.commodityPrice - priceConfig.handPrice)
        }
      } else if (item.selectable) {
        _selectedAll = false
      }
    })
    totalPrice = Number(totalPrice.toFixed(2))
    discount = Number(discount.toFixed(2))
    let stat = {
      totalCount,
      totalPrice,
      discount,
      priceArr: String(priceFormat(totalPrice)).split('.'),
    }
    setStat(stat)
    onUpdateStat?.(stat)
    setSelectedAll(_selectedAll && totalCount > 0)
  }

  const calcCartPrice = (skus: any[]) => {
    if (skus.length === 0) return
    postMarketingMobileCbgActivityPriceCalculate({
      cbgActivityId: Number(activityId),
      cartActivityPriceReqList: skus.map((item) => {
        return {
          shopId: shopAndSite?.id || 0,
          productId: item.purchaseSkuResp.commodity.id,
          skuId: item.purchaseSkuResp.id,
          commodityType: item.purchaseCommodityType,
          quantity: item.count,
          upperMemberId: upperMemberId || 0,
          upperRoleId: upperRoleId || 0,
          purchaseId: item.id,
        }
      }),
    })
      .then((res) => {
        if (res.code === 1000) {
          let map = res.data?.reduce((prev, cur) => {
            prev[cur.skuId] = cur
            return prev
          }, {})
          setPriceMap(Object.assign({}, priceMap, map))
        }
      })
      .catch(() => {})
  }

  const handleClose = () => {
    onClose?.()
  }

  const handleSelectOne = (skuId: number, count: number, commodityId: number) => {
    let i = skuIdsRef.current.indexOf(skuId)
    if (i < 0) {
      checkQuantity(skuId, count, commodityId)
    } else {
      skuIdsRef.current.splice(i, 1)
      setCartSelectedSkuIdsMap(activityId, pickupPoint?.teamLeaderId, skuIdsRef.current)
      updateStat()
    }
  }

  const handleSelectAll = () => {
    if (selectedAll) {
      skuIdsRef.current = []
      setCartSelectedSkuIdsMap(activityId, pickupPoint?.teamLeaderId, skuIdsRef.current)
      updateStat()
    } else {
      for (let index = 0; index < cartList.length; index++) {
        let item = cartList[index]
        if (!skuIdsRef.current.includes(item.purchaseSkuResp.id) && item.selectable) {
          handleSelectOne(item.purchaseSkuResp.id, item.count, item.purchaseSkuResp.commodity.id)
        }
      }
    }
  }

  const handleCountChange = (index: number, value: number) => {
    let list = [...cartList]
    let item = list[index]
    let skuId = item.purchaseSkuResp.id
    let stockCount = activityStockMap ? Math.min(item.stockCount, activityStockMap[skuId] || 0) : item.stockCount
    if (value > stockCount || value < item?.purchaseSkuResp?.commodity?.minOrder) {
      setCartList(list)
      return
    }
    let oldValue = item.count
    item.count = value
    setCartList(list)
    if (skuIdsRef.current.includes(skuId)) {
      checkQuantity(skuId, value, item.purchaseSkuResp.commodity.id)
        .then(() => {})
        .catch(() => {
          list = [...cartList]
          list[index].count = oldValue
          setCartList(list)
        })
    }
  }

  const checkQuantity = (skuId, quantity, productId, isAdd = false) => {
    return new Promise((resolve, reject) => {
      showLoading({
        title: intl.formatMessage({ id: 'teamLeader.tijiaozhong', defaultMessage: '提交中' }),
        mask: true,
      })
      if (isAdd) {
        for (let item of cartList) {
          if (item.purchaseSkuResp.id === skuId) {
            quantity += item.count
            break
          }
        }
      }
      postMarketingMobileCbgActivityGoodsCheckQuantity({
        quantity,
        skuId,
        productId,
        activityId: Number(activityId),
      })
        .then((res) => {
          if (res.code === 1000) {
            let list = [...cartList]
            for (let item of list) {
              if (item.purchaseSkuResp.id === skuId) {
                item.count = quantity
                break
              }
            }
            setCartList(list)
            savePurchase(skuId, quantity)
              .then((result) => {
                hideLoading()
                if (!skuIdsRef.current.includes(skuId)) {
                  skuIdsRef.current.push(skuId)
                  setCartSelectedSkuIdsMap(activityId, pickupPoint?.teamLeaderId, skuIdsRef.current)
                  updateStat()
                }
                resolve(result)
              })
              .catch((e) => {
                hideLoading()
                reject(e)
              })
          } else {
            hideLoading()
            showToast({
              title: res.message,
              icon: 'error',
              duration: 2000,
            })
            updateStat()
            reject(res.message)
          }
        })
        .catch(() => {
          hideLoading()
          let title = intl.formatMessage({
            id: 'communityGroupBuy.activity.fuwufanmang',
            defaultMessage: '服务繁忙',
          })
          showToast({
            title,
            icon: 'error',
          })
          updateStat()
          reject(title)
        })
    })
  }

  const savePurchase = (skuId: number, count: number) => {
    return new Promise((resolve, reject) => {
      let postData = {
        cbgActivityId: Number(activityId),
        cbgTeamLeaderId: pickupPoint?.teamLeaderId,
        commoditySkuId: skuId,
        count,
        id: 0,
      }
      for (const item of cartList) {
        if (skuId === item.purchaseSkuResp.id) {
          postData.id = item.id
          break
        }
      }
      postProductShopPurchaseSaveOrUpdatePurchase(postData)
        .then((res) => {
          if (res.code === 1000) {
            if (postData.id === 0) {
              skuIdsRef.current.push(skuId)
              refresh()
            } else if (!skuIdsRef.current.includes(skuId)) {
              skuIdsRef.current.push(skuId)
              setCartSelectedSkuIdsMap(activityId, pickupPoint?.teamLeaderId, skuIdsRef.current)
              updateStat()
              for (const item of cartList) {
                if (postData.id === item.id) {
                  calcCartPrice([item])
                  break
                }
              }
            }
            resolve(res.data)
          } else {
            reject('')
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const handleDelete = (id, index) => {
    showLoading({
      title: intl.formatMessage({ id: 'communityGroupBuy.activity.shanchuzhong', defaultMessage: '删除中' }),
      mask: true,
    })
    postProductShopPurchaseDeletePurchase({ idList: [id] })
      .then((res) => {
        hideLoading()
        if (res.code === 1000) {
          let list = [...cartList]
          let item = list.splice(index, 1)[0]
          let skuId = item.purchaseSkuResp.id
          let i = skuIdsRef.current.indexOf(skuId)
          if (i >= 0) {
            skuIdsRef.current.splice(i, 1)
          }
          setCartList(list)
        } else {
          showToast({
            title:
              res.message ||
              intl.formatMessage({ id: 'communityGroupBuy.activity.shanchushibai', defaultMessage: '删除失败' }),
            icon: 'error',
          })
        }
      })
      .catch((e) => {
        hideLoading()
        showToast({
          title: intl.formatMessage({ id: 'communityGroupBuy.activity.shanchushibai', defaultMessage: '删除失败' }),
          icon: 'error',
        })
      })
  }

  const confirmOrder = () => {
    setDeliveryTypeStore(deliveryType)
    setstoreItem(pickupPoint)
    const payload = {}
    cartList.forEach((cart) => {
      const {
        goodsCartResp,
        purchaseSkuResp,
        purchaseSkuResp: { commodity, commoditySkuAttributeList, unitPrice },
      } = cart
      if (!skuIdsRef?.current.includes(purchaseSkuResp.id)) {
        return
      }
      let payloadKey = `shopId_${commodity?.memberId}`
      let list = payload[payloadKey]
      if (!list) {
        list = []
        payload[payloadKey] = list
      }
      const priceMessage = fnGetPriceAndAction(unitPrice, cart.count)
      const priceConfig = priceMap[purchaseSkuResp?.id]
      let item = {
        activityDetails: goodsCartResp?.activityDetails,
        brandId: commodity?.brandId,
        brandName: commodity?.brandName,
        commodityId: commodity?.id,
        commodityLogo: commodity?.mainPic,
        commoditySku: commoditySkuAttributeList.map((item) => ({
          name: item.customerAttribute?.name,
          value: item.customerAttributeValue?.value,
          id: item.id,
        })),
        count: cart.count,
        customerCategoryId: commodity?.customerCategoryId,
        customerCategoryName: commodity?.customerCategoryName,
        estimatePrice: priceConfig.handPrice,
        handPrice: priceConfig.handPrice,
        // basePrice: priceConfig.basePrice,
        basePrice: priceConfig.handPrice,
        // commodityPrice: priceConfig.commodityPrice,
        commodityPrice: priceConfig.handPrice,
        // saleTotalAmount: priceConfig.saleTotalAmount,
        saleTotalAmount: 0,
        // 预计到手价，购物车那边说不用传
        id: cart.id,
        // 购物车id，无
        isMemberPrice: commodity?.isMemberPrice,
        isPublish: cart?.isPublish,
        logistics: commodity?.logistics,
        memberId: commodity?.memberId,
        memberName: commodity?.memberName,
        memberRoleId: commodity?.memberRoleId,
        minOrder: commodity?.minOrder,
        name: commodity?.name,
        // newPrice: priceMessage.newPrice, // 当前商品价格
        newPrice: priceConfig.handPrice, // 当前商品价格
        newAction: priceMessage.newAction, // 当前的梯度
        // // 当前价格，购物车那边说目前只传阶梯价哇
        parameter: cart.parameter,
        priceType: commodity?.priceType,
        skuId: `${purchaseSkuResp.id}_${cart.id}`,
        stockCount: cart.stockNum,
        taxRate: commodity?.taxRate,
        topActivityDetail: goodsCartResp?.topActivityDetail,
        // // 购物车那边说是 顶部的活动，不用传哇
        unitName: commodity?.unitName,
        unitPrice: unitPrice,
        upperCommodityId: commodity?.upperCommodityId,
        upperMemberId: commodity?.upperMemberId,
        upperMemberName: commodity?.upperMemberName,
        upperMemberRoleId: commodity?.upperMemberRoleId,
        upperMemberRoleName: commodity?.upperMemberRoleName,
        storeId: commodity?.storeId,
        storeLogo: commodity?.storeLogo,
        storeName: commodity?.storeName,
        commodityAreaList: commodity?.commodityAreaList,
        limitWay: commodity?.salesAreaTemplate?.limitWay,
        isAllArea: commodity?.isAllArea,
        isCrossBorder: commodity?.isCrossBorder,
      }
      list.push(item)
    })
    setShopMessageStore(payload)
    Router.navigateTo('order/ConfirmOrder', {
      cbgActivityId: activityId,
      cbgTeamLeaderId: pickupPoint?.teamLeaderId,
      defaultDeliveryType: '2',
    })
  }

  const changeSelfPickupPoint = () => {
    // Router.navigateTo('communityGroupBuy/changeSelfPickupAddress')
  }

  return (
    <Popup
      visible={visible}
      title="购物车"
      onClose={handleClose}
      overlayStyle={{
        zIndex: 100,
      }}
      zIndex={101}
      customTitleStyle={{
        paddingLeft: '12px',
        backgroundColor: THEME_COLORS.surface,
        borderBottom: 'none',
        textAlign: 'left',
        fontSize: '16px',
        fontWeight: '500',
      }}
      preload
    >
      <View className={styles.wrapper} style={{ paddingBottom: pxTransform(safeBottomHeight) }}>
        <View className={styles.address}>
          <Image
            src={selectedAll ? CheckedIcon : DefaultIcon}
            className={styles['select-icon']}
            onClick={handleSelectAll}
          />
          <View className={styles['address-text']} onClick={changeSelfPickupPoint}>
            {pickupPoint?.pickupPointName}
          </View>
          <Icons name="ChevronDown" size={12} onClick={changeSelfPickupPoint} />
        </View>
        <ScrollView scrollY className={styles.list}>
          <View className={styles['list-content']}>
            {cartList?.length > 0 ? (
              cartList.map((item, index) => (
                <Item
                  key={index}
                  data={item}
                  priceConfig={priceMap[item.purchaseSkuResp.id]}
                  selected={skuIdsRef.current.includes(item.purchaseSkuResp.id)}
                  activityStock={activityStockMap?.[item.purchaseSkuResp.id] || 0}
                  onSelect={() => {
                    if (item.selectable) {
                      const sku = item.purchaseSkuResp
                      handleSelectOne(sku.id, item.count, sku.commodity.id)
                    }
                  }}
                  onCountChange={(count) => {
                    handleCountChange(index, count)
                  }}
                  onDelete={() => {
                    handleDelete(item.id, index)
                  }}
                />
              ))
            ) : (
              <EmptyLayout />
            )}
          </View>
        </ScrollView>
        <View className={styles['footer']}>
          <View className={styles['footer-content']}>
            <View className={styles['footer-content-left']}>
              <Image
                src={selectedAll ? CheckedIcon : DefaultIcon}
                className={styles['select-icon']}
                onClick={handleSelectAll}
              />
              <View className={styles['footer-content-left-text']}>
                {intl.formatMessage({ id: 'communityGroupBuy.activity.yixuan', defaultMessage: '已选' })}
                {stat.totalCount}
              </View>
            </View>
            <View className={styles['footer-content-price']}>
              <View className={styles['footer-content-price-total']}>
                <Text className={styles['footer-content-price-total-text1']}>
                  {intl.formatMessage({ id: 'communityGroupBuy.activity.zongji', defaultMessage: '总计' })}:
                </Text>
                <Text>￥</Text>
                <Text className={styles['footer-content-price-total-text2']}>{stat.priceArr[0]}</Text>
                {stat.priceArr[1] && <Text>.{stat.priceArr[1]}</Text>}
              </View>
              {stat.discount > 0 && (
                <View className={styles['footer-content-price-discount']}>
                  {intl.formatMessage({ id: 'communityGroupBuy.activity.yiyouhui', defaultMessage: '已优惠' })} ￥
                  {priceFormat(stat.discount)}
                </View>
              )}
            </View>
            {stat.totalCount > 0 ? (
              <View className={styles['footer-content-button']} onClick={confirmOrder}>
                {intl.formatMessage({ id: 'communityGroupBuy.activity.quzhifu', defaultMessage: '去支付' })}
              </View>
            ) : (
              <View className={cs(styles['footer-content-button'], styles.disabled)}>
                {intl.formatMessage({ id: 'communityGroupBuy.activity.weixuanshangpin', defaultMessage: '未选商品' })}
              </View>
            )}
          </View>
        </View>
      </View>
    </Popup>
  )
})

export default React.memo(ActivityCart)
