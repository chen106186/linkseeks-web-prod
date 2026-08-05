import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import Taro from '@tarojs/taro'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import useStores from '@/store/useStores'
import {
  useRouter,
  showToast,
  hideToast,
  usePageScroll,
  useDidShow,
  pxTransform,
  useShareAppMessage,
  setStorageSync,
} from '@apps/mobile-services/utils/taro'
import { View, Image, Text, Icons, Badge, Button } from '@apps/mobile-ui'
import { useStatusBarHeight, useSafeArea } from '@apps/mobile-services'
import {
  postProductMobileCommodityGetSkuBySkuIdList,
  postProductMobileCommodityGetCommodityByCommoditySkuIdList,
} from '@apps/apis'
import useGetCbgActivityDetail from '../../hooks/useGetCbgActivityDetail'
import NavBar from '@/components/NavBar'
import cs from 'classnames'
import styles from './index.module.scss'
import { observer } from 'mobx-react-lite'
import ProductCard from './components/ProductCard'
import ActivityCart, { ActivityCartStatType, ActivityCartRefHandle } from '../../components/ActivityCart'
import CountDown from '../../components/CountDown'
import SkuPopup, { SkuListItemType, SkuPopupRefHandle } from '../../components/SkuPopup'
import { normalizeSpecSkuList, normalizeSpecGroups, ProductSkuType } from '../../components/SkuPopup/utils'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { fnGetActivityDeliveryType } from '../../commonlyFn'
const shareIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/share.png'

type ActivityDetailRouteParams = {
  activityId: string
  pickupPointId: string
  shareStatus: string
}

const CommunityGroupBuyList: React.FC<{}> = () => {
  const router = useRouter<ActivityDetailRouteParams>()
  const {
    params: { activityId, pickupPointId, shareStatus },
  } = router
  const { statusBarHeight } = useStatusBarHeight()
  const { safeBottomHeight } = useSafeArea()
  const navHeight = `calc(${statusBarHeight}PX + 44px)`
  const intl = useIntl()
  const {
    userStore: { userInfo },
  } = useStores()
  const {
    detail: activityDetail,
    pickupPoint,
    productList,
    activeName,
  } = useGetCbgActivityDetail({
    activityId: +activityId,
    teamLeaderId: +pickupPointId,
  })
  const [skuListMap, setSkuListMap] = useState<any>({})
  const [stockMap, setStockMap] = useState<any>({})
  const [publishProductIds, setPublishProductIds] = useState<Array<number>>([])
  const [navBgColor, setNavBgColor] = useState('transparent')
  usePageScroll(({ scrollTop }) => {
    let ignoredH = 20
    let actionH = 100
    let top = scrollTop - ignoredH
    if (top < 0) {
      setNavBgColor('transparent')
    } else if (top > actionH) {
      setNavBgColor('#fff')
    } else {
      setNavBgColor(`rgba(255, 255, 255, ${top / actionH})`)
    }
  })

  useDidShow(() => {
    cartRef?.current?.refresh()
  })

  useEffect(() => {
    getProductListBySkuIds(productList)
  }, [productList])

  const getProductListBySkuIds = (goodsList: any[]) => {
    let skuPriceMap = {}
    goodsList?.forEach((item) => {
      item.skuList?.forEach((sku) => {
        skuPriceMap[sku.skuId] = sku
      })
    })
    let skuIds = Object.keys(skuPriceMap).map(Number)
    if (!skuIds.length) return
    postProductMobileCommodityGetSkuBySkuIdList({
      idList: skuIds,
    })
      .then((res) => {
        if (res.code === 1000) {
          let commodityMap = res.data
          postProductMobileCommodityGetCommodityByCommoditySkuIdList({
            idList: skuIds,
          })
            .then((res2) => {
              if (res2.code === 1000) {
                let skuMap = {}
                let publishProductIds: Array<number> = []
                res2.data?.forEach((item: any) => {
                  Object.assign(skuMap, { [item.id]: item })
                  if (item.status === 5) {
                    publishProductIds.push(+item.commodityId)
                  }
                })
                setPublishProductIds(publishProductIds)
                let _stockMap = {}
                Object.values(commodityMap)?.forEach((list: any[]) => {
                  for (const index in list) {
                    let sku = list[index]
                    let sku1 = skuMap[sku.id]
                    let sku2 = skuPriceMap[sku.id]
                    let stockCount = Math.min(sku.stockCount, sku2.stockNum)
                    list[index] = Object.assign(sku1, sku2, sku, {
                      stockCount,
                    })
                    _stockMap[sku.id] = stockCount
                  }
                })
                setSkuListMap(commodityMap)
                setStockMap(_stockMap)
              }
            })
            .catch((e) => {})
        }
      })
      .catch((e) => {})
  }

  const handleClickProduct = (product) => {
    Router.navigateTo('communityGroupBuy/productDetail', {
      cbgActivityId: activityId,
      cbgTeamLeaderId: pickupPoint?.teamLeaderId,
      commodityId: product.productId,
    })
  }

  const handleAddProduct = (product) => {
    const {
      productId,
      productName,
      productImgUrl,
      skuList,
      currentSku: { skuId },
    } = product
    const _skuList = skuListMap[productId] || []
    setProductSkuList(_skuList)
    setProductInfo({
      id: productId,
      name: productName,
      min: 0,
      max: 0,
      unitName: 0,
      mainPic: productImgUrl,
      minOrder: 0,
      aboutPrice: 0,
      subUnitName: 0,
      activePrive: 0,
      originalPrice: 0,
    })
    let skuListData = normalizeSpecSkuList(_skuList as any, 1, PRICE_TYPE_ENUM.SPOT)
    setSkuList(skuListData)
    let _currentSku
    skuListData.forEach((item) => {
      if (item.skuId === skuId) {
        _currentSku = item
      }
    })
    if (!_currentSku) {
      _currentSku = skuListData[0]
    }
    setCurrentSku(_currentSku)
    if (skuList?.length > 1) {
      setVisibleSkuPopup(true)
    } else {
      handleSkuConfirm(_currentSku, productId)
    }
  }

  /**
   * 选择规格
   */
  const skuPopupRef = useRef<SkuPopupRefHandle | null>(null)
  const [visibleSkuPopup, setVisibleSkuPopup] = useState(false)
  const [skuConfirmLoading, setSkuConfirmLoading] = useState(false)
  const [productInfo, setProductInfo] = useState<any>({
    id: 0,
    name: '',
    min: 0,
    max: 0,
    unitName: '',
    mainPic: '',
    minOrder: 0,
    aboutPrice: 0,
    subUnitName: '',
  })
  const [productSkuList, setProductSkuList] = useState<any[]>([])
  const [skuList, setSkuList] = useState<SkuListItemType[]>([])
  const [currentSku, setCurrentSku] = useState<SkuListItemType>({
    skuId: 0,
    price: 0,
    stockNum: 0,
    quantity: 0,
    specNames: [],
  })
  const skuGroups = useMemo(() => normalizeSpecGroups(productSkuList as any), [productSkuList])
  const handleVisibleSkuPopup = (flag?: boolean) => {
    setVisibleSkuPopup(!!flag)
  }

  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }

  const handleSkuChange = (v) => {
    setCurrentSku(v)
  }

  const handleSkuStepperChange = (value: number) => {
    let newData: ProductSkuType = {
      ...currentSku,
    }
    newData.quantity = value
    if (newData.ladder.length) {
      // 如果 找不到 active，说明当前数量超过了已有的价格区间，取最后一个价格区间为准
      // 当然这样不够严谨，如果数量小于 0 的话就不适用了
      // 但是当前场景不会出现 数量小于 0 的情况
      const current = newData.ladder.findIndex(
        (ladderItem, i) =>
          (value >= ladderItem.star && value <= ladderItem.end) ||
          (newData.ladder[i + 1] && value > ladderItem.end && value < newData.ladder[i + 1].star),
      )
      const active = current !== -1 ? current : newData.ladder.length - 1
      newData = Object.assign(newData, {
        active,
        priceValue: newData.ladder[active].price,
      })
    }
    setCurrentSku(newData)
  }

  useEffect(() => {
    for (const item of productSkuList) {
      if (item.id === currentSku.skuId) {
        setProductInfo(
          Object.assign({}, productInfo, {
            min: item.min,
            max: item.max,
            unitName: item.unit,
            minOrder: item.minOrder,
            aboutPrice: 0,
            subUnitName: item.subUnitName,
            activePrive: item.activityPrice,
            originalPrice: item.price,
          }),
        )
        return
      }
    }
  }, [currentSku, productSkuList])

  // sku确认
  const handleSkuConfirm = (value: SkuListItemType, commodityId: number) => {
    if (skuConfirmLoading) {
      return
    }
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    hideToast()
    if (value.quantity <= 0) {
      return showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.quantity.required',
          defaultMessage: '请选择购买数量',
        }),
        icon: 'none',
      })
    }
    if (value.quantity < productInfo?.minOrder!) {
      return showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.quantity.legal',
          defaultMessage: '购买数量不可小于商品起订量',
        }),
        icon: 'none',
      })
    }
    if (!value.stockNum) {
      return showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.soldOut',
          defaultMessage: '暂无库存，看看其他的吧',
        }),
        icon: 'none',
      })
    }
    cartRef?.current
      ?.addProduct(value.skuId, value.quantity, commodityId, true)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setSkuConfirmLoading(false)
        setVisibleSkuPopup(false)
      })
  }

  /**
   * 购物车
   */
  const cartRef = useRef<ActivityCartRefHandle | null>(null)
  const [cartStat, setCartStat] = useState<ActivityCartStatType | null>(null)
  const [visibleCartPopup, setVisibleCartPopup] = useState(false)

  const handleUpdateCartStat = (stat: ActivityCartStatType) => {
    setCartStat(stat)
  }

  const handleVisibleCartPopup = (flag?: boolean) => {
    setVisibleCartPopup(!!flag)
  }

  const tagStyle = {
    video: 'width: 100%;',
  }

  const handleBack = () => {
    const pages = Taro.getCurrentPages()
    if (pages.length > 1) {
      Router.navigateBack()
    } else {
      Router.redirectTo('communityGroupBuy/list')
    }
  }

  // 分享页面
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      return {
        title: activeName,
        // 参数： 活动id 团长id 分享状态
        path: `/packages/communityGroupBuy/pages/activityDetail/index?activityId=${activityId}&pickupPointId=${pickupPointId}&shareStatus=1`,
      }
    }
    return {}
  })

  return (
    <View className={styles['container']}>
      <View className={styles['top']}>
        <Image className={styles['top-image']} mode="widthFix" src={activityDetail.picture} />
        <View className={styles['top-share']}>
          <Button openType="share" className={styles['top-share-btn']}>
            <Image className={styles['top-share-icon']} src={shareIcon} />
            <View className={styles['top-share-text']}>
              {intl.formatMessage({ id: 'teamLeader.fenxiang', defaultMessage: '分享' })}
            </View>
          </Button>
        </View>
      </View>
      <NavBar
        customRenderLeft={
          <View className={styles['navbar-back']} onClick={handleBack}>
            <Icons name="ChevronLeft" size={18} color="#252D37" />
            <Text>
              {intl.formatMessage({ id: 'communityGroupBuy.activity.xuanzezitidian', defaultMessage: '选择自提点' })}
            </Text>
          </View>
        }
        customClassName={styles.navbar}
        customStyle={`background: ${navBgColor};height: ${navHeight};`}
      />
      <View className={styles['activity-status']} style={{ top: navHeight, background: navBgColor }}>
        <View className={cs(styles['activity-status-content'], activityDetail.status === 3 && styles.end)}>
          <View className={styles['team-leader']}>
            {intl.formatMessage({ id: 'communityGroupBuy.activity.tuanzhang', defaultMessage: '团长' })}：
            {pickupPoint?.name}
          </View>
          {activityDetail?.status === 3 ? (
            <View className={cs(styles['activity-status-content-end-tag'])}>
              {intl.formatMessage({ id: 'communityGroupBuy.activity.status.yijieshu', defaultMessage: '已结束' })}
            </View>
          ) : (
            <View className={cs(styles['activity-status-content-time'])}>
              <View className={cs(styles['ml-4'], styles['mr-4'])}>
                {activityDetail?.status === 2
                  ? intl.formatMessage({ id: 'communityGroupBuy.activity.status.jujieshu', defaultMessage: '距结束' })
                  : intl.formatMessage({ id: 'communityGroupBuy.activity.status.jujieshu', defaultMessage: '距开始' })}
              </View>
              <CountDown time={activityDetail?.status === 2 ? activityDetail.endTime : activityDetail.startTime} />
            </View>
          )}
        </View>
      </View>
      {productList.map(
        (item, index) =>
          skuListMap.hasOwnProperty(item.productId) && (
            <ProductCard
              key={index.toString()}
              data={item}
              isPublish={publishProductIds.includes(item.productId)}
              onClick={handleClickProduct}
              onAdd={handleAddProduct}
            />
          ),
      )}
      <View className={styles['delivery-info']}>
        <View className={styles['delivery-info-title']}>
          {intl.formatMessage({ id: 'communityGroupBuy.activity.fahuoxinxi', defaultMessage: '发货信息' })}
        </View>
        <View className={cs(styles['delivery-info-item'], styles['inline'], styles['border-bottom'])}>
          <View className={styles['delivery-info-item-label']}>
            {intl.formatMessage({ id: 'communityGroupBuy.activity.peisongfangshi', defaultMessage: '配送方式' })}
          </View>
          <View className={cs(styles['delivery-info-item-value'], styles['inline'])}>
            {fnGetActivityDeliveryType(activityDetail.deliveryType)}
          </View>
        </View>
        <View className={styles['delivery-info-item']}>
          <View className={styles['delivery-info-item-label']}>
            {intl.formatMessage({ id: 'communityGroupBuy.activity.fahuoshuoming', defaultMessage: '发货说明' })}
          </View>
          <View className={styles['delivery-info-item-value']}>{activityDetail?.shippingTimeDescription}</View>
        </View>
      </View>
      {(activityDetail?.customDetail || activityDetail?.detail) && (
        <View className={styles['activity-info']}>
          <View className={styles['activity-info-title']}>
            <View className={styles['activity-info-title-line']} />
            <View className={styles['activity-info-title-line']} />
            <View className={styles['activity-info-title-text']}>
              {intl.formatMessage({ id: 'communityGroupBuy.activity.huodongxinxi', defaultMessage: '活动信息' })}
            </View>
            <View className={styles['activity-info-title-line']} />
            <View className={styles['activity-info-title-line']} />
          </View>
          <parser html={activityDetail?.customDetail || activityDetail?.detail} tag-style={tagStyle} />
        </View>
      )}
      <View className={styles['footer']} style={{ paddingBottom: pxTransform(safeBottomHeight) }}>
        <View className={styles['footer-content']}>
          <View
            className={styles['footer-content-cart']}
            onClick={() => {
              handleVisibleCartPopup(true)
            }}
          >
            <Icons name="ShoppingCart" size={24} color="#00A98F" />
            <Badge className={styles['footer-content-cart-badge']} count={cartStat?.totalCount} color="#E34D59" />
          </View>
          <View className={styles['footer-content-price']}>
            <View className={styles['footer-content-price-total']}>
              <Text className={styles['footer-content-price-total-text1']}>
                {intl.formatMessage({ id: 'communityGroupBuy.activity.zongji', defaultMessage: '总计' })}:
              </Text>
              <Text>￥</Text>
              <Text className={styles['footer-content-price-total-text2']}>{cartStat?.priceArr[0]}</Text>
              {cartStat?.priceArr[1] && <Text>.{cartStat?.priceArr[1]}</Text>}
            </View>
            {(cartStat?.discount || 0) > 0 && (
              <View className={styles['footer-content-price-discount']}>
                {intl.formatMessage({ id: 'communityGroupBuy.activity.yiyouhui', defaultMessage: '已优惠' })} ￥
                {cartStat?.discount.toLocaleString()}
              </View>
            )}
          </View>
          {(cartStat?.totalCount || 0) > 0 ? (
            <View className={styles['footer-content-button']} onClick={() => cartRef?.current?.confirmOrder()}>
              {intl.formatMessage({ id: 'communityGroupBuy.activity.qujiesuan', defaultMessage: '去结算' })}
            </View>
          ) : (
            <View className={cs(styles['footer-content-button'], styles.disabled)}>
              {intl.formatMessage({ id: 'communityGroupBuy.activity.weixuanshangpin', defaultMessage: '未选商品' })}
            </View>
          )}
        </View>
      </View>
      <View className={styles['footer-holder']} style={{ paddingBottom: pxTransform(safeBottomHeight) }} />

      {/* SKU选择弹窗 */}
      <SkuPopup
        ref={skuPopupRef}
        visible={visibleSkuPopup}
        productInfo={productInfo}
        groups={skuGroups}
        skuList={skuList}
        commoditySkuList={productSkuList}
        onClose={() => handleVisibleSkuPopup(false)}
        value={currentSku}
        onChange={handleSkuChange}
        onStepperChange={handleSkuStepperChange}
        onConfirm={handleSkuConfirm}
        confirmLoading={skuConfirmLoading}
      />

      <ActivityCart
        ref={cartRef}
        visible={visibleCartPopup}
        activityId={activityId}
        deliveryType={activityDetail.deliveryType}
        pickupPoint={pickupPoint}
        activityStockMap={stockMap}
        onUpdateStat={handleUpdateCartStat}
        onClose={handleVisibleCartPopup}
      />
    </View>
  )
}

export default GlobalWrapper(observer(CommunityGroupBuyList))
