import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useReducer, useRef, useMemo, useCallback } from 'react'
import { View, Text, Button, Icons, Toast, CountDown } from '@apps/mobile-ui'
import {
  useRouter,
  useShareAppMessage,
  showToast,
  hideToast,
  pxTransform,
  getLaunchOptionsSync,
} from '@apps/mobile-services/utils/taro'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import useStores from '@/store/useStores'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { SHOP_PROPERTY, SHOP_TYPE } from '@/constants/const/shop'
import { getManageContentNoticeFindWithOutContent, getCommodityMobileCameraListByCommodity } from '@apps/apis'
import useProductConst from '@/hooks/useProductConst'
import Router from '@/utils/router'
import { numFormat, priceFormat } from '@/utils/numberFormat'
import useJmpHome from '@/hooks/useJmpHome'
import { postMarketingMobileActivityOrderGroupPurchaseDetail } from '@apps/apis'
import { GetProductMobileShopStoreGetCommodityDetailResponse } from '@apps/apis'
import GoodsAction from '@/packages/commodityMerge/components/GoodsAction'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import BusinessCard, { SupplierInfoData } from '@/components/BusinessCard'
// import { GlobalConfig } from '@/constants/global';
import useCustomerService from '@/hooks/useCustomerService'
import Label from '@/components/Label'
import Banner from '../../../components/Banner'
import Bookshelf from '../../../components/Bookshelf'
import EvaluateRecordCard from '../../../components/EvaluateRecordCard'
import TransactionRecordCard from '../../../components/TransactionRecordCard'
import ProductDescriptions from '../../../components/Descriptions'
import Anchor from '../../../components/Anchor'
import Gap from '../../../components/Gap'
import SkuPopup, { SkuListItemType, SkuPopupRefHandle } from '../../../components/SkuPopup'
import { normalizeSpecGroups, normalizeSpecSkuList, ProductSkuType } from '../../../components/SkuPopup/utils'
import Stock from '../../../components/Stock'
import StockAddressPopup from '../../../components/StockAddressPopup'
import DeliveryCycle from '../../../components/DeliveryCycle'
import './index.scss'
import useGetProductDetail from '../../../hooks/useGetProductDetail'
import useGetPriceHistory from '../../../hooks/useGetPriceHistory'
import useCollectionAction from '../../../hooks/useCollectionAction'
import useGetShopInfo from '../../../hooks/useGetShopInfo'
import useGetTradeSummary from '../../../hooks/useGetTradeSummary'
import useGetTradeRecord from '../../../hooks/useGetTradeRecord'
import useGetEvaluateRecord from '../../../hooks/useGetEvaluateRecord'
import useGetMarketingCampaign from '../../../hooks/useGetMarketingCampaign'
import useStockAddress from '../../../hooks/useStockAddress'
import useGetTeamData from './hooks/useGetTeamData'
import ShareModal from '../components/ShareModal'
import CollageCard from '../components/Collage/collageCard'
import CollageModal from '../components/Collage/collageModal'
import { MarketingCampaignType } from '../components/MarketingCampaign'
import { IS_WEB } from '@apps/mobile-services/constants'
import { isWeChat } from '@/utils'
import { useMobileIntl } from '@apps/locales'
import useWxConfig from '@/hooks/useWxConfig'

// ========== 摄像头相关类型定义 ==========
type CameraItem = {
  id: number
  cameraId: number
  cameraName: string
  coverUrl: string
  directionName: string
  sortOrder: number
  cameraStatus: number
  videoUrl: {
    id?: string
    url?: string
    expireTime?: string
    accessToken?: string
  } | null
}

/*
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ezplayer: any
    }
  }
}
*/

type RouteParams = {
  /**
   * 商品id
   */
  commodityId: string
  /**
   * 渠道会员id
   */
  channelMemberId?: string
  /**
   * 商品 skuId，用于查详情接口，订单那边只保存了 skuId，
   * 所以要调别的接口来查询商品详情
   * 目前只有 评价那边跳转商品详情才是这样的
   */
  skuId?: string
  /** 从h5 带过来的shopid shopId */
  h5ShopId?: string
  /** 从h5 带过来的拼团详情id */
  h5TeamId?: string
  showIM?: string
}
interface ProductInfo extends GetProductMobileShopStoreGetCommodityDetailResponse {
  /**
   * 渠道商品id
   */
  channelCommodityId?: number
  /**
   * 已售数量(会员商品)
   */
  sold: number
  /**
   * 已售数量(渠道商品)
   */
  channelSold?: number
}
interface ShopInfo extends SupplierInfoData {
  volume: number
}
type MarketingCampaignData = MarketingCampaignType & {
  /**
   * 秒杀活动结束时间
   */
  seckillEndTime: number
}
type SelectedTeamInfo = {
  teamId: number
  isInvite: boolean
  leftNum: number
  endTime: number
  /**
   * 1 拼团中
   * 2 成功
   * 3 失败
   */
  status?: 1 | 2 | 3
}

type FunctionItem = {
  title: string
  columnType: number
  content: string
  status: string
  id: string
  top: string
}

// const { customerServiceInfo } = GlobalConfig.global
const customerServiceInfo: any = {}
let toastIns: any = null
const StocksSourcingDetail: React.FC = () => {
  const { routerToCustomerService } = useCustomerService()
  const router = useRouter<RouteParams>()
  const {
    params: { commodityId, skuId, channelMemberId, h5ShopId, h5TeamId, showIM },
  } = router
  /** self -> 单独购买， team: 创建拼团， joinTeam: 加入拼团， confirmSku: 确认sku */
  const [form, setForm] = useState<'self' | 'team' | 'joinTeam' | 'confirmSku'>('team')
  /** 选中的拼团id */
  const [selectedTeamInfo, setSelectedTeamInfo] = useState<null | SelectedTeamInfo>(null)
  const [visibleSkuPopup, setVisibleSkuPopup] = useState(false)
  /** 正在拼团列表页visible */
  const [visible, setVisible] = useState<boolean>(false)
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false)
  const [shareStatus, setShareStatus] = useState<'share' | 'shareSuccess'>('share')
  const [isDifferentShop, setIsDifferentShop] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isInTeam, setIsInTeam] = useState<boolean>(false)
  const endTime = (!isInTeam && selectedTeamInfo?.endTime) || 0
  const currentTime = new Date().valueOf()
  const offset = Math.floor((endTime - currentTime) / 1000)
  const translate = useMobileIntl()
  const { wxConfig } = useWxConfig()

  // ========== 摄像头相关状态 ==========
  const [cameraList, setCameraList] = useState<CameraItem[]>([])
  const [activeCameraIndex, setActiveCameraIndex] = useState(0)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [videoError, setVideoError] = useState(false)
  // const [marketingCampaign, setMarketingCampaign] = useState<MarketingCampaignData | null>(null);

  const {
    purchaseOrderStore: { setShopMessageStore },
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const skuPopupRef = useRef<SkuPopupRefHandle | null>(null)
  const formRef = useRef<'self' | 'team' | 'joinTeam' | 'confirmSku'>('team')
  const isEnterpriseBCShop = !shopAndSite?.isSelf
  const {
    banner,
    productInfo,
    skuList,
    currentSku,
    setCurrentSku,
    productReducer,
    getPayWay,
    productDispatch,
    vipParameter,
    renderPayWay,
    loading,
  } = useGetProductDetail({
    commodityId: +commodityId,
    skuId: skuId ? +skuId : undefined,
    from: null,
    channelMemberId: +channelMemberId!,
  })
  const { showHistoricalAnalysis } = useGetPriceHistory({
    commodityId: +commodityId,
  })
  const { isCollected, collectLoading, handleCollect } = useCollectionAction({
    productInfo,
    channelMemberId: +channelMemberId!,
  })
  const { supplierInfo } = useGetShopInfo({
    productInfo,
  })
  const { tradeSummary } = useGetTradeSummary({
    commodityId: +commodityId,
  })
  const { transactionRecordLoading, transactionRecord } = useGetTradeRecord({
    commodityId: +commodityId,
  })
  const { evaluateRecordLoading, evaluateRecord } = useGetEvaluateRecord({
    commodityId: +commodityId,
  })
  const { teamList, teamsCount } = useGetTeamData({
    commodityId: +commodityId,
    initPageSize: 2,
    visible: isInTeam || !h5TeamId,
    userInfo,
  })
  const { marketingCampaign, getMarketingCampaign, groupPurchasingData, fetchCheckQuantity } = useGetMarketingCampaign({
    dispatch: productDispatch,
    skuList,
    setCurrentSku,
    productInfo,
    isGroupPurchasing: true,
    skuId: skuId ? +skuId : undefined,
    channelMemberId: +channelMemberId!,
  })
  const {
    visibleStockAddressPopup,
    handleVisibleStockAddressPopup,
    stockAddress,
    handleStockAddressChange,
    stockStatus,
    handleStockStatusChange,
  } = useStockAddress()
  const skuCanGroupPurchasing = useMemo(() => {
    if (marketingCampaign === null) {
      return false
    }
    return marketingCampaign?.tagDetailList.length > 0
  }, [marketingCampaign])
  const { jmpHome } = useJmpHome()
  const intl = useIntl()
  const teamProductInfoOrDefaultData =
    form === 'self'
      ? {
          ...productReducer,
          activePrive: null,
        }
      : {
          ...productReducer,
          teamNum: groupPurchasingData?.groupNum!,
          activePrive: groupPurchasingData?.groupPurchasingPrice,
        }
  const collageShareInfo = {
    ...productReducer,
    teamNum: groupPurchasingData?.groupNum,
    activePrive: groupPurchasingData?.groupPurchasingPrice,
    commodityId: +commodityId,
    ...shopAndSite,
  }

  /** 格式化拼团价格 */
  const parseGroupPurchasingPrice = useMemo(() => {
    const tempPrice =
      groupPurchasingData?.groupPurchasingPrice || productReducer?.vipPrice || productReducer.ladderPrice || 0
    return tempPrice?.toString().split('.')
  }, [groupPurchasingData, productReducer])
  const parseSkuPrice = useMemo(() => {
    const tempPrice = productReducer?.vipPrice || productReducer.ladderPrice || 0
    return tempPrice.toString().split('.')
  }, [productReducer])

  // ========== 摄像头相关逻辑 ==========
  useEffect(() => {
    if (commodityId) {
      setCameraLoading(true)
      getCommodityMobileCameraListByCommodity({ commodityId })
        .then((res: any) => {
          if (res.code === 1000 && res.data) {
            const list = Array.isArray(res.data) ? res.data : res.data.cameraList || []
            if (list.length > 0) {
              setCameraList(list)
              const onlineIndex = list.findIndex((item: CameraItem) => item.cameraStatus === 1)
              setActiveCameraIndex(onlineIndex !== -1 ? onlineIndex : 0)
            }
          }
        })
        .catch((error: any) => console.error('获取摄像头列表失败:', error))
        .finally(() => setCameraLoading(false))
    }
  }, [commodityId])

  const getAccessToken = useCallback((camera: CameraItem | undefined): string => {
    if (!camera?.videoUrl?.accessToken) return ''
    return camera.videoUrl.accessToken
  }, [])

  const getPlayUrl = useCallback((camera: CameraItem | undefined): string => {
    if (!camera?.videoUrl?.url) return ''
    return camera.videoUrl.url
  }, [])

  const handleSwitchCamera = useCallback(
    (index: number) => {
      if (cameraList[index]?.cameraStatus !== 1) {
        showToast({ title: '当前摄像头不在线', icon: 'none' })
      }
      setActiveCameraIndex(index)
      setVideoError(false)
    },
    [cameraList],
  )

  const getStatusText = useCallback((status: number) => {
    const map: Record<number, string> = { 0: '未检测', 1: '在线', 2: '离线', 3: '异常' }
    return map[status] || '未知'
  }, [])

  const getStatusColor = useCallback((status: number) => {
    const map: Record<number, string> = { 0: '#ff9800', 1: '#4caf50', 2: '#9e9e9e', 3: '#f44336' }
    return map[status] || '#999'
  }, [])

  const handleEzplayerError = useCallback((e: any) => {
    console.error('播放器错误:', e.detail)
    setVideoError(true)
    showToast({ title: '视频播放失败', icon: 'none' })
  }, [])

  const handleEzplayerControlEvent = useCallback((e: any) => {
    console.log('控制事件:', e.detail)
  }, [])

  const renderCameraView = useCallback(() => {
    if (cameraLoading) {
      return (
        <>
          <Gap />
          <MellowCard title="视频溯源">
            <View className="camera-loading">
              <View className="camera-loading__spinner" />
              <Text className="camera-loading__text">加载中...</Text>
            </View>
          </MellowCard>
        </>
      )
    }

    if (!cameraList.length) return null

    const current = cameraList[activeCameraIndex]
    const isOnline = current.cameraStatus === 1
    const playUrl = getPlayUrl(current)
    const accessToken = getAccessToken(current)
    const canPlay = isOnline && playUrl && accessToken && !videoError
    const screenWidth = Taro.getSystemInfoSync().windowWidth
    const rpxToPx = (rpx: number) => rpx * (screenWidth / 750)

    const width = screenWidth - rpxToPx(80)
    const height = width * (9 / 16)

    const shouldAutoPlay = canPlay && activeCameraIndex !== 0

    return (
      <>
        <Gap />
        <MellowCard title="基地直播视频溯源">
          <View className="camera-view">
            <View className="camera-view__player" style={'height:' + height + 'px'}>
              {canPlay ? (
                <View>
                  {/* ezplayer 插件暂时注释，待完成微信插件授权后恢复
                  <ezplayer
                    id={`ezplayer_${activeCameraIndex}`}
                    key={`ezplayer_${activeCameraIndex}`}
                    width={width}
                    height={height}
                    className="camera-view__video"
                    accessToken={accessToken}
                    url={playUrl}
                    plugins=""
                    theme={{
                      poster: current.coverUrl,
                      showCapture: false,
                      showBottomBar: false,
                      showDatePicker: false,
                      showTypeSwitch: false,
                      showProgress: false,
                      showPlaybackRate: false,
                      showDefinition: false,
                      showVolume: false,
                      showFullscreen: false,
                    }}
                    muted={true}
                    autoPlay={shouldAutoPlay}
                    bindhandleerror={handleEzplayerError}
                    bindoncontrolevent={handleEzplayerControlEvent}
                  ></ezplayer>
                  */}
                  <View className="camera-view__placeholder">
                    {current.coverUrl && <img src={current.coverUrl} alt="" className="camera-view__cover" />}
                    <View
                      className="camera-view__status-overlay"
                      style={{ backgroundColor: getStatusColor(current.cameraStatus) + 'CC' }}
                    >
                      <Text className="camera-view__status-text">ezplayer 插件暂未启用</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="camera-view__placeholder">
                  {current.coverUrl && <img src={current.coverUrl} alt="" className="camera-view__cover" />}
                  <View
                    className="camera-view__status-overlay"
                    style={{ backgroundColor: getStatusColor(current.cameraStatus) + 'CC' }}
                  >
                    <Text className="camera-view__status-text">
                      {videoError ? '播放失败' : getStatusText(current.cameraStatus)}
                    </Text>
                  </View>
                  {!isOnline && (
                    <View className="camera-view__name-overlay">
                      <Text className="camera-view__name-text">{current.directionName || current.cameraName}</Text>
                    </View>
                  )}
                </View>
              )}
              {canPlay && shouldAutoPlay && (
                <View className="camera-view__live-badge">
                  <View className="camera-view__live-dot" />
                  <Text className="camera-view__live-text">LIVE</Text>
                </View>
              )}
            </View>

            {cameraList.length > 1 && (
              <View className="camera-view__tabs">
                <View className="camera-view__tabs-scroll">
                  {cameraList.map((cam, i) => (
                    <View
                      key={cam.id}
                      className={`camera-view__tab ${activeCameraIndex === i ? 'camera-view__tab--active' : ''}`}
                      onClick={() => handleSwitchCamera(i)}
                    >
                      <View
                        className="camera-view__tab-dot"
                        style={{ backgroundColor: getStatusColor(cam.cameraStatus) }}
                      />
                      <Text className="camera-view__tab-text">{cam.directionName || cam.cameraName}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </MellowCard>
      </>
    )
  }, [
    cameraLoading,
    cameraList,
    activeCameraIndex,
    videoError,
    getPlayUrl,
    getAccessToken,
    getStatusText,
    getStatusColor,
    handleSwitchCamera,
    handleEzplayerError,
    handleEzplayerControlEvent,
  ])

  useEffect(() => {
    if (!h5ShopId) {
      return
    }
    if (+h5ShopId !== shopAndSite?.id) {
      Toast.show({
        title: intl.formatMessage({
          id: 'commodityMerge.soleSourcingDetailGroup.shop.legal',
          defaultMessage: '您当前所进入的商城无法参与该拼团活动，请切换商城',
        }),
        icon: 'none',
      })
      setIsDifferentShop(true)
      return
    }
    async function getTeamData() {
      const { code, data } = await postMarketingMobileActivityOrderGroupPurchaseDetail({
        id: +h5TeamId!,
      })
      if (code === 1000) {
        // isJoin 是否已在团中
        const currentIsJoin = (data as any).isJoin ?? false
        if (currentIsJoin) {
          setIsInTeam(currentIsJoin)
        }
        setSelectedTeamInfo({
          teamId: +h5TeamId!,
          isInvite: !currentIsJoin,
          endTime: data.endTime,
          leftNum: data.num,
          status: data.status as 1,
        })
      }
    }
    getTeamData()
  }, [userInfo])
  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }
  const handleVisibleSkuPopup = (flag?: boolean) => {
    setVisibleSkuPopup(!!flag)
  }

  /** 单独购买 */
  const handleAdd = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    setForm('self')
    formRef.current = 'self'
    handleVisibleSkuPopup(true)
  }

  /** 成团购买 */
  const handleBuyNow = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    setForm(!isInTeam && h5TeamId ? 'joinTeam' : 'team')
    formRef.current = !isInTeam && h5TeamId ? 'joinTeam' : 'team'
    handleVisibleSkuPopup(true)
  }
  const handleBuyNow2 = () => {
    skuPopupRef.current?.onConfirm()
  }
  useShareAppMessage(
    (res: {
      from: 'button'
      target: {
        dataset: {
          teamId: number
        }
      }
    }) => {
      console.log(
        'share',
        `/packages/commodityMerge/pages/stocksSourcing/shareGroupDetail/index?teamId=${res.target.dataset.teamId}&shopId=${collageShareInfo?.id}&shopType=1&commodityId=${commodityId}&shopProperty=${shopAndSite?.property}&isSelf=${shopAndSite?.isSelf}&skuId=${currentSku.skuId}`,
      )
      if (res.from === 'button') {
        // 来自页面内转发按钮
        return {
          title: intl.formatMessage({
            id: 'commodityMerge.soleSourcingDetailGroup.share.wechat',
            was: collageShareInfo?.originalPrice,
            num: collageShareInfo?.teamNum,
            activityPrice: collageShareInfo?.activePrive,
            yuan: intl.formatMessage({
              id: 'yuan',
              defaultMessage: '元',
            }),
          }),
          path: `/packages/commodityMerge/pages/stocksSourcing/shareGroupDetail/index?teamId=${res.target.dataset.teamId}&shopId=${collageShareInfo?.id}&shopType=1&commodityId=${commodityId}&shopProperty=${shopAndSite?.property}&isSelf=${shopAndSite?.isSelf}&skuId=${currentSku.skuId}`,
          imageUrl: `${collageShareInfo?.mainPic}`,
        }
      }
      return {}
    },
  )

  const handleShare = (teamId: number) => {
    if (!IS_WEB) return
    if (!isWeChat()) {
      Toast.show({ title: translate('mobile.common.qingzaiweixinxiashiyong'), icon: 'none' })
      return
    }
    wxConfig()
    Toast.show({ title: translate('mobile.common.qingdianjiyoushangjiao'), icon: 'none' })
    const prefix = `${window.location.origin}/#/packages/commodityMerge/pages/stocksSourcing/shareGroupDetail/index`
    const url = `${prefix}?commodityId=${commodityId}&teamId=${teamId}&shopId=${collageShareInfo?.id}&shopType=1&skuId=${currentSku.skuId}`
    const shareData = {
      link: url,
      title: intl.formatMessage({
        id: 'commodityMerge.soleSourcingDetailGroup.share.wechat',
        was: collageShareInfo?.originalPrice,
        num: collageShareInfo?.teamNum,
        activityPrice: collageShareInfo?.activePrive,
        yuan: intl.formatMessage({
          id: 'yuan',
          defaultMessage: '元',
        }),
      }),
      imgUrl: `${collageShareInfo?.mainPic}`,
      success: function () {
        console.log('success')
      },
      fail: function (e) {
        console.log('error', e)
      },
    }
    wx.ready(function () {
      wx.updateAppMessageShareData({ ...shareData })
      wx.updateTimelineShareData({ ...shareData })
    })
  }

  const handleBuyBoth = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    setForm('confirmSku')
    formRef.current = 'confirmSku'
    handleVisibleSkuPopup(true)
  }
  const handleJoinTeam = (option: { teamId: number; isInvite: boolean; leftNum: number; endTime: number }) => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    // setSelectedTeamId(option.teamId)
    setVisible(false)
    setSelectedTeamInfo(option)
    if (option.isInvite) {
      setShareModalVisible(true)
      return
    }
    setForm('joinTeam')
    formRef.current = 'joinTeam'
    setTimeout(() => {
      handleVisibleSkuPopup(true)
    }, 500)
  }
  const handleSkuChange2 = (value: SkuListItemType) => {
    // 断言一下下
    setCurrentSku(value as ProductSkuType)
    if (!productInfo) {
      return
    }
    getMarketingCampaign({
      shopId: shopAndSite?.id!,
      categoryId: productInfo?.customerCategoryId!,
      brandId: productInfo?.brandId,
      productId: productInfo.id,
      memberId: productInfo.memberId,
      roleId: productInfo.memberRoleId,
      skuId: value.skuId,
      filterGroup: false,
    })
    if (userInfo) {
      getPayWay(productInfo.memberId, productInfo.memberRoleId, {
        productId: productInfo.id,
        skuId: value.skuId,
        freightType: productInfo.logistics?.carriageType,
        crossBorder: productInfo.isCrossBorder,
      })
    }
    productDispatch({
      type: 'setProductMiniInfo',
      payload: {
        ladderPrice: (value as ProductSkuType).ladderPrice,
        aboutPrice: (value as ProductSkuType).aboutPrice,
        vipPrice: vipParameter?.current
          ? +((value as ProductSkuType).ladderPrice * vipParameter?.current).toFixed(2)
          : productReducer.vipPrice,
        originalPrice: (value as ProductSkuType).ladder[0]?.price || 0, // 取第一阶梯的价格
      },
    })
  }

  // 购买数量改变
  const handleStepperChange = (value: number) => {
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
      productDispatch({
        type: 'setProductMiniInfo',
        payload: {
          ladderPrice: newData.ladder[active].price,
          vipPrice: vipParameter?.current
            ? +(newData.ladder[active].price * vipParameter?.current).toFixed(2)
            : productReducer.vipPrice,
        },
      })
    }
    setCurrentSku(newData)
  }
  const getSubmitData = () => {
    const sku = productInfo?.commoditySkuList.find((item) => item.id === currentSku.skuId)
    const withTeamId =
      form === 'joinTeam'
        ? {
            recordId: selectedTeamInfo?.teamId,
          }
        : {}
    const payload = {
      [`shopId_${productInfo?.memberId}`]: [
        {
          activityDetails: marketingCampaign?.tagDetailList.map((_item) => {
            const { preferentialTagDesc, ...rest } = _item
            if (rest.activityType === 9) {
              return {
                ...rest,
                ...withTeamId,
              }
            }
            return rest
          }),
          brandId: productInfo?.brandId,
          brandName: productInfo?.brandName,
          commodityId: productInfo?.id,
          commodityLogo: productInfo?.mainPic,
          commoditySku: sku?.commoditySkuAttributeList.map((item) => ({
            name: item.customerAttribute?.name,
            value: item.customerAttributeValue?.value,
            id: item.id,
          })),
          count: currentSku.quantity,
          customerCategoryId: productInfo?.customerCategoryId,
          customerCategoryName: productInfo?.customerCategoryName,
          estimatePrice: 0,
          // 预计到手价，购物车那边说不用传
          id: 0,
          // 购物车id，无
          isMemberPrice: productInfo?.isMemberPrice,
          isPublish: true,
          // 商品是否上架，商品详情没有这个数据，如果是分享出去的话那就可能出现商品下架了，坑！！！
          logistics: productInfo?.logistics,
          memberId: productInfo?.memberId,
          memberName: productInfo?.memberName,
          memberRoleId: productInfo?.memberRoleId,
          minOrder: productInfo?.minOrder,
          name: productInfo?.name,
          newAction: currentSku?.active,
          // 当前阶梯
          newPrice: productReducer?.ladderPrice,
          // 当前价格，购物车那边说目前只传阶梯价哇
          parameter: vipParameter?.current,
          priceType: productInfo?.priceType,
          skuId: currentSku.skuId,
          stockCount: currentSku.stockNum,
          taxRate: productInfo?.taxRate,
          topActivityDetail: {},
          // 购物车那边说是 顶部的活动，不用传哇
          unitName: productInfo?.unitName,
          unitPrice: sku?.unitPrice,
          upperCommodityId: productInfo?.upperCommodityId,
          upperMemberId: productInfo?.upperMemberId,
          upperMemberName: productInfo?.upperMemberName,
          upperMemberRoleId: productInfo?.upperMemberRoleId,
          upperMemberRoleName: productInfo?.upperMemberRoleName,
          storeId: productInfo?.storeId,
          /** 活动id */
          // activityId: groupPurchasingData?.activityId,
          /** 是否是拼团， 确认订单那里需要判断调拼团接口 */
          isGroupPurchasing: form === 'team' || form === 'joinTeam',
          commodityAreaList: productInfo?.commodityAreaList,
          isAllArea: productInfo?.isAllArea,
          isCrossBorder: productInfo?.isCrossBorder,
        },
      ],
    }
    return payload
  }

  // sku确认
  const handleSkuConfirm = async (value: SkuListItemType) => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    if (toastIns) {
      hideToast(toastIns)
    }
    if (value.quantity <= 0) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.quantity.required',
          defaultMessage: '请选择购买数量',
        }),
        icon: 'none',
      })
      return
    }
    if (value.quantity < productInfo?.minOrder!) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.quantity.legal',
          defaultMessage: '购买数量不可小于商品起订量',
        }),
        icon: 'none',
      })
      return
    }
    if (!currentSku.stockNum) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.soldOut',
          defaultMessage: '暂无库存，看看其他的吧',
        }),
        icon: 'none',
      })
      return
    }
    if (!skuCanGroupPurchasing && (formRef.current === 'team' || formRef.current === 'joinTeam')) {
      Toast.show({
        title: intl.formatMessage({
          id: 'commodityMerge.soleSourcingDetailGroup.ineligible',
          defaultMessage: '很遗憾，您当前无资格参与本次拼团活动',
        }),
        icon: 'none',
      })
      return
    }
    if (form === 'confirmSku') {
      handleVisibleSkuPopup(false)
      return
    }
    console.log('formRef.current', formRef.current)
    // 如果是单独购买的话，即不参与拼团不创建拼团，那么不走活动限购 判断当前商品是否有营销活动，有则调用接口判断购买数量是否超过活动限购数量
    if (formRef.current !== 'self' && marketingCampaign && marketingCampaign.tagDetailList) {
      const pass = await fetchCheckQuantity(2, value.skuId, value.quantity)
      if (!pass) {
        return
      }
    }
    hideToast()
    const payload = getSubmitData()
    setShopMessageStore(payload)
    Router.navigateTo('order/ConfirmOrder')
  }
  const handleContinuesShare = () => {
    setShareStatus('share')
  }

  const skuGroups = useMemo(
    () => normalizeSpecGroups(productInfo?.commoditySkuList as any),
    [productInfo?.commoditySkuList],
  )

  const [columnTypeList, setColumnTypeList] = useState<FunctionItem[][]>([])
  useEffect(() => {
    if ([1, 2].includes(productInfo?.adoptionType)) {
      getManageContentNoticeFindWithOutContent({ id: productInfo?.adoptionAgreementId }).then((res: any) => {
        if (res.code === 1000) {
          setColumnTypeList(res.data)
        }
      })
    }
  }, [productInfo])

  const webView = (item: any) => {
    Router.navigateTo('basicSetting/webView', {
      id: item.id,
      type: 'sign',
      columnType: item.columnType,
    })
  }
  const xy = () => {
    return columnTypeList
      .filter((item) => item.id === productInfo?.adoptionAgreementId)
      .map((items: any) => (
        <Text
          key={items.id}
          className="agrbox-signRight"
          style="font-size:15px;"
          onClick={(e) => {
            e.stopPropagation()
            webView(items)
          }}
        >
          {`《${items.title}》`}
        </Text>
      ))
  }
  // 按钮禁用
  // 目前只有不可以配送状态时
  // 如有需要也可再拆分两个变量各自控制 加入购物车、立即购买的状态
  const actionsDisabled = stockStatus === 0
  return (
    <>
      <PageLayout
        renderHeader={
          <>
            <NavBar
              title={intl.formatMessage({
                id: 'commodityMerge.common.nav',
                defaultMessage: '商品详情',
              })}
            />
          </>
        }
      >
        <Anchor customClassName="stocksSourcing-detail-anchor">
          <View className="stocksSourcing-detail">
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.product',
                defaultMessage: '商品',
              })}
              customClassName="stocksSourcing-detail-anchor-item"
            >
              {/* 商品图 */}
              <Banner banner={banner} />
              {/* 基本信息 */}
              <Gap />
              <MellowCard
                bodyStyle={{
                  padding: 0,
                }}
              >
                <View className="product-basic">
                  <View className="product-priceWrap">
                    <View className="product-priceWrap-left">
                      <Text className="product-price">
                        {intl.formatMessage({
                          id: 'currency',
                          defaultMessage: '¥',
                        })}
                        <Text className="product-price-big">{numFormat(+parseGroupPurchasingPrice?.[0])}</Text>.
                        {parseGroupPurchasingPrice?.[1] || '00'}
                      </Text>
                      <Text
                        className={classNames('product-price__original', 'product-price__through')}
                      >{`${intl.formatMessage({
                        id: 'currency',
                        defaultMessage: '¥',
                      })} ${priceFormat(productReducer.originalPrice)}`}</Text>
                    </View>
                    {groupPurchasingData?.groupNum && (
                      <Label
                        name={intl.formatMessage({
                          id: 'commodityMerge.soleSourcingDetailGroup.num',
                          num: groupPurchasingData?.groupNum,
                        })}
                        type="danger"
                      />
                    )}
                  </View>
                  <View className="product-name">{productInfo?.name}</View>
                  {productInfo && productInfo.slogan && <View className="product-describe">{productInfo?.slogan}</View>}
                  {productInfo?.sellingPoint && productInfo?.sellingPoint.length > 0 ? (
                    <View className="product-tags">
                      {productInfo?.sellingPoint.map((item, index) => (
                        <Text key={index} className="product-tags-item">
                          {item}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
                {/* 历史价格曲线 */}
                {/* {showHistoricalAnalysis ? (
                  <HistoricalAnalysisBar
                    skuId={currentSku.skuId}
                    currentPrice={productReducer?.min}
                    onJump={() => handleVisibleVisibleHistoricalAnalysis(true)}
                  />
                 ) : null} */}
              </MellowCard>
              {(isInTeam || !h5TeamId) && teamList.length > 0 && skuCanGroupPurchasing && (
                <>
                  <Gap />
                  <CollageCard
                    teamList={teamList}
                    teamsCount={teamsCount}
                    onJoin={handleJoinTeam}
                    onShare={handleShare}
                    // collageShareInfo={collageShareInfo as any}
                    onHeaderClick={() => setVisible(true)}
                  />
                </>
              )}
              {/* 其他信息 */}
              <Gap />
              <MellowCard
                bodyStyle={{
                  paddingTop: pxTransform(0),
                  paddingBottom: pxTransform(0),
                }}
              >
                <Bookshelf
                  labelWidth={64}
                  customStyle={{
                    paddingRight: pxTransform(0),
                    paddingLeft: pxTransform(0),
                  }}
                >
                  {skuGroups.length > 0 ? (
                    <Bookshelf.Item
                      label={intl.formatMessage({
                        id: 'commodityMerge.common.sku.selected',
                        defaultMessage: '已选',
                      })}
                      content={
                        currentSku.specNames.length
                          ? currentSku.specNames.join('；')
                          : intl.formatMessage({
                              id: 'commodityMerge.common.sku.required',
                              defaultMessage: '请选择规格',
                            })
                      }
                      onPress={handleBuyBoth}
                      isLink
                    />
                  ) : null}
                  {productInfo && productInfo.minOrder !== 1 ? (
                    <Bookshelf.Item
                      label={intl.formatMessage({
                        id: 'commodityMerge.common.min',
                        defaultMessage: '起订量',
                      })}
                      content={`${productInfo && productInfo.minOrder ? productInfo.minOrder : ''}${
                        productInfo && productInfo.unitName ? `/${productInfo?.unitName}` : ''
                      }`}
                    />
                  ) : null}
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.deliveryType',
                      defaultMessage: '配送',
                    })}
                    content={
                      productInfo && productInfo.logistics
                        ? `${DELIVERY_TYPE_TEXT[productInfo?.logistics?.deliveryType] || ''}`
                        : ''
                    }
                  />
                  <Stock
                    unlimited={productInfo?.isAllArea!}
                    areas={productInfo?.commodityAreaList!}
                    address={stockAddress!}
                    onJump={() => handleVisibleStockAddressPopup(true)}
                    onStatusChange={handleStockStatusChange}
                    shippingAddressId={productInfo?.logistics?.sendAddressId!}
                    deliveryType={productInfo?.logistics?.deliveryType!}
                  />
                  <DeliveryCycle days={productInfo?.sendCycle!} />
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.payMethod',
                      defaultMessage: '支付',
                    })}
                    content={renderPayWay()}
                    customStyle={{
                      alignItems: 'flex-start',
                    }}
                  />
                  {userInfo && columnTypeList.length && (
                    <Bookshelf.Item
                      label={intl.formatMessage({
                        id: 'commodityMerge.common.xy',
                        defaultMessage: '协议',
                      })}
                      content={xy()}
                      customStyle={{
                        alignItems: 'flex-start',
                      }}
                    />
                  )}
                </Bookshelf>
              </MellowCard>
              {/* 采购商名片 */}
              {isEnterpriseBCShop ? (
                <>
                  <Gap />
                  <MellowCard>
                    <BusinessCard
                      data={supplierInfo}
                      describeExtra={
                        <Text className="shop-volume">
                          {`${productInfo ? productInfo.sold || 0 : 0}${intl.formatMessage({
                            id: 'commodityMerge.common.sold',
                            defaultMessage: '成交',
                          })}`}
                        </Text>
                      }
                      extra={
                        supplierInfo.id && (
                          <Button type="secondary" size="small" circle>
                            {intl.formatMessage({
                              id: 'commodityMerge.common.visit',
                              defaultMessage: '进店',
                            })}
                          </Button>
                        )
                      }
                    />
                  </MellowCard>
                </>
              ) : null}
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.reviews',
                defaultMessage: '评价',
              })}
              customClassName="stocksSourcing-detail-anchor-item"
            >
              {/* ========== 视频溯源组件 ========== */}
              {renderCameraView()}
              {/* 评价 */}
              <Gap />
              <EvaluateRecordCard
                dataSource={evaluateRecord.data}
                loading={evaluateRecordLoading}
                tradeSummary={tradeSummary}
                params={{
                  commodityId: +commodityId,
                  shopType: 1,
                }}
              />
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.transaction',
                defaultMessage: '成交',
              })}
              customClassName="stocksSourcing-detail-anchor-item"
            >
              {/* 交易记录 */}
              <Gap />
              <TransactionRecordCard
                title={intl.formatMessage({
                  id: 'commodityMerge.common.transaction.record',
                  defaultMessage: '交易记录',
                })}
                dataSource={transactionRecord as any}
                loading={transactionRecordLoading}
                priceType={productInfo && productInfo.priceType ? productInfo.priceType : 0}
                params={{
                  commodityId: +commodityId,
                  shopId: shopAndSite?.id || 0,
                }}
              />
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.details',
                defaultMessage: '详情',
              })}
            >
              {/* 商品媒体 */}
              <ProductDescriptions commodityRemarkList={(productInfo?.commodityRemarkList as any[]) || []} />
            </Anchor.Item>
          </View>
        </Anchor>
      </PageLayout>
      <View className="stocksSourcing-detail-fixedWrap">
        <GoodsAction>
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'commodityMerge.common.home',
              defaultMessage: '首页',
            })}
            icon="Home"
            onClick={jmpHome}
          />
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'commodityMerge.common.list',
              defaultMessage: '收藏',
            })}
            icon={!isCollected ? 'Star' : 'StarFill'}
            color={!isCollected ? '#303133' : '#D32F2F'}
            onClick={() => handleCollect(productInfo?.id!, isCollected)}
          />
          {showIM != '0' && customerServiceInfo?.id ? (
            <GoodsAction.Icon
              text={intl.formatMessage({
                id: 'commodityMerge.common.customerService',
                defaultMessage: '客服',
              })}
              icon="Chat"
              onClick={routerToCustomerService}
            />
          ) : null}
          {productInfo?.isPublish && !isDifferentShop ? (
            <>
              {(h5TeamId && !isInTeam && (
                <GoodsAction.Button>
                  <CountDown count={offset}>
                    {(time, formatedData) =>
                      (time > 0 && selectedTeamInfo?.status === 1 && (
                        <View
                          className={classNames('fixedWrap-actions-item-btn', 'fixedWrap-actions-item-teamBuy-btn')}
                          onClick={handleBuyNow}
                        >
                          <Text className="fixedWrap-actions-item-teamBuy-money">
                            {intl.formatMessage({
                              id: 'commodityMerge.soleSourcingDetailGroup.again',
                              defaultMessage: '继续参与TA的拼团',
                            })}
                          </Text>
                          <Text className="fixedWrap-actions-item-teamBuy-money">
                            {intl.formatMessage({
                              id: 'commodityMerge.soleSourcingDetailGroup.end',
                              defaultMessage: '剩余',
                            })}
                            ：{formatedData.formatTimeString}
                          </Text>
                        </View>
                      )) || (
                        <Button type="primary" disabled>
                          {intl.formatMessage({
                            id: 'commodityMerge.soleSourcingDetailGroup.over',
                            defaultMessage: '拼团结束',
                          })}
                        </Button>
                      )
                    }
                  </CountDown>
                </GoodsAction.Button>
              )) || (
                <>
                  <GoodsAction.Button>
                    <Button className="button-wrapper" onClick={handleAdd} disabled={actionsDisabled}>
                      <View className="fixedWrap-actions-item-btn">
                        <Text className="fixedWrap-actions-item-selfBuy-money">
                          {intl.formatMessage({
                            id: 'currency',
                            defaultMessage: '¥',
                          })}
                          <Text className="fixedWrap-actions-item-selfBuy-money-big">{parseSkuPrice[0]}</Text>.
                          {parseSkuPrice?.[1] || '00'}
                        </Text>
                        <Text className="fixedWrap-actions-item-selfBuy-money">
                          {intl.formatMessage({
                            id: 'commodityMerge.soleSourcingDetailGroup.buy',
                            defaultMessage: '单独购买',
                          })}
                        </Text>
                      </View>
                    </Button>
                  </GoodsAction.Button>
                  <GoodsAction.Button>
                    <Button className="button-wrapper" onClick={handleBuyNow} disabled={actionsDisabled}>
                      <View className={classNames('fixedWrap-actions-item-btn', 'fixedWrap-actions-item-teamBuy-btn')}>
                        <Text className="fixedWrap-actions-item-teamBuy-money">
                          {intl.formatMessage({
                            id: 'currency',
                            defaultMessage: '¥',
                          })}
                          <Text className="fixedWrap-actions-item-teamBuy-money-big">
                            {parseGroupPurchasingPrice[0]}
                          </Text>
                          .{parseGroupPurchasingPrice?.[1] || '00'}
                        </Text>
                        <Text className="fixedWrap-actions-item-teamBuy-text">
                          {intl.formatMessage({
                            id: 'commodityMerge.soleSourcingDetailGroup.launch',
                            defaultMessage: '发起拼团',
                          })}
                        </Text>
                      </View>
                    </Button>
                  </GoodsAction.Button>
                </>
              )}
            </>
          ) : (
            <GoodsAction.Button>
              <Button type="primary" disabled>
                {!loading
                  ? intl.formatMessage({
                      id: 'commodityMerge.common.removed',
                      defaultMessage: '商品已下架',
                    })
                  : intl.formatMessage({
                      id: 'commodityMerge.common.loading',
                      defaultMessage: '正在加载...',
                    })}
              </Button>
            </GoodsAction.Button>
          )}
        </GoodsAction>
      </View>
      {/* SKU选择弹窗 */}
      <SkuPopup
        visible={visibleSkuPopup}
        productInfo={{
          ...teamProductInfoOrDefaultData,
          adoptionType: productInfo?.adoptionType,
          adoptionAgreementId: productInfo?.adoptionAgreementId,
        }}
        groups={skuGroups}
        skuList={skuList}
        commoditySkuList={productInfo?.commoditySkuList}
        onClose={() => handleVisibleSkuPopup(false)}
        value={currentSku}
        onChange={handleSkuChange2}
        onStepperChange={handleStepperChange}
        onConfirm={handleSkuConfirm}
        confirmLoading={confirmLoading}
        ref={skuPopupRef}
        customRenderActions={
          <GoodsAction safeAreaInsetBottom={false}>
            {productInfo?.isPublish ? (
              <>
                <GoodsAction.Button>
                  <Button type="primary" onClick={handleBuyNow2} disabled={actionsDisabled}>
                    {form === 'self'
                      ? intl.formatMessage({
                          id: 'commodityMerge.soleSourcingDetail.buy',
                          defaultMessage: '立即购买',
                        })
                      : form === 'joinTeam'
                      ? intl.formatMessage({
                          id: 'commodityMerge.soleSourcingDetailGroup.join',
                          defaultMessage: '参与拼团',
                        })
                      : intl.formatMessage({
                          id: 'commodityMerge.soleSourcingDetailGroup.launch',
                          defaultMessage: '发起拼团',
                        })}
                  </Button>
                </GoodsAction.Button>
              </>
            ) : (
              <GoodsAction.Button>
                <Button type="primary" disabled>
                  {intl.formatMessage({
                    id: 'commodityMerge.common.removed',
                    defaultMessage: '商品已下架',
                  })}
                </Button>
              </GoodsAction.Button>
            )}
          </GoodsAction>
        }
        confirmDisabled={actionsDisabled}
      />
      {/* <HistoricalAnalysisPopup
        visible={visibleHistoricalAnalysis}
        onClose={() => handleVisibleVisibleHistoricalAnalysis(false)}
        skuId={currentSku.skuId}
        currentPrice={currentSku.price}
       /> */}
      {/* 优惠活动弹窗 */}
      {/* 这里本身是放在 MarketingCampaign组件里边的，但是如果放里边要正常显示必须使用 Modal，这就跟 Toast 冲突了，Toast展示不出来 */}
      {/* {marketingCampaign && (
        <MarketingPopup
          data={marketingCampaign}
          visible={visibleMarketing}
          onClose={() => handleVisibleMarketing(false)}
          shopId={shopAndSite?.id!}
          skuId={currentSku?.skuId}
        />
       )} */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onShare={handleShare}
        mode={shareStatus}
        endTime={selectedTeamInfo?.endTime!}
        leftNum={selectedTeamInfo?.leftNum!}
        onContinueShare={handleContinuesShare}
      />
      <CollageModal
        visible={visible}
        commodityId={+commodityId}
        onClose={() => setVisible(false)}
        onJoin={handleJoinTeam}
      />
      {/* 配送至弹窗 */}
      <StockAddressPopup
        visible={visibleStockAddressPopup}
        onClose={() => handleVisibleStockAddressPopup(false)}
        onChange={handleStockAddressChange}
      />
    </>
  )
}
export default GlobalWrapper(observer(StocksSourcingDetail))
