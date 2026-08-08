import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Image, Text } from '@apps/mobile-ui'
import { RichText, Button } from '@tarojs/components'
import NavBar from '@/components/NavBar'
import {
  getMarketingMobileCbgTeamLeaderActivityInfo,
  postMarketingMobileCbgTeamLeaderSignUpActivity,
  postProductMobileCommodityGetSkuBySkuIdList,
  postMarketingMobileCbgTeamLeaderSaveCustomActivityDetail,
} from '@apps/apis'
import uploadFileRequest from '@/utils/uploadFileRequest'
import cs from 'classnames'
import styles from './index.module.scss'
import { observer } from 'mobx-react-lite'
import ProductCard from './components/ProductCard'
import {
  pxTransform,
  showToast,
  usePageScroll,
  useRouter,
  useDidShow,
  useShareAppMessage,
  showLoading,
  hideLoading,
} from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { useStatusBarHeight } from '@apps/mobile-services'
import { formatDateFromTimestamp } from '../../utils/formatter'
import Router from '@/utils/router'
import { normalizeSpecGroups, normalizeSpecSkuList, ProductSkuType } from '../../components/SkuPopup/utils'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import SkuPopup, { SkuListItemType, SkuPopupRefHandle } from '../../components/SkuPopup'
import cx from 'classnames'
import useJmpHome from '@/hooks/useJmpHome'
import useStores from '@/store/useStores'
const shareIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/share.png'
import Taro from '@tarojs/taro'

type DateMap = {
  d: string
  h: string
  m: string
  s: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      rich: any
    }
  }
}

const TeamLeaderGroupBuyDetail: React.FC<{}> = () => {
  const { activityId, shareStatus, enterType } = useRouter().params
  const { jmpHome } = useJmpHome()
  const {
    userStore: { userInfo },
  } = useStores()
  const intl = useIntl()
  const isFirstLoad = useRef(true)
  const [loading, setLoading] = useState(false)
  const [countdownStarted, setCountdownStarted] = useState(false)
  // 请求标记，防止接口失败时倒计时反复请求
  const [requestFailed, setRequestFailed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { statusBarHeight } = useStatusBarHeight()
  const navHeight = `calc(${statusBarHeight}PX + 44px)`
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

  useEffect(() => {
    getActivityDetail()
  }, [])

  // useDidShow(() => {
  //   getActivityDetail()
  // })

  // 活动详情信息
  const [activityDetailInfo, setActivityDetailInfo] = useState<any>({})

  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())
  const [timeMap, setTimeMap] = useState<DateMap>({
    d: '00',
    h: '00',
    m: '00',
    s: '00',
  })
  // 定时器启动，只在 activityDetailInfo.status 非3 时启动
  useEffect(() => {
    if (!activityDetailInfo || activityDetailInfo.status === 3 || requestFailed) return
    setCountdownStarted(false) // 复位倒计时开始状态

    const timer = setInterval(() => {
      setCurrentTimestamp(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [activityDetailInfo?.status])

  // 倒计时计算
  useEffect(() => {
    if (!activityDetailInfo || activityDetailInfo.status === 3) return

    // 状态为未开始，但开始时间已过，数据异常
    if (activityDetailInfo.status === 1 && activityDetailInfo.startTime < currentTimestamp) {
      console.log('活动状态为未开始，但开始时间已过，疑似数据异常，停止刷新')
      hideLoading()
      return
    }

    // 状态为进行中，但结束时间已过，数据异常
    if (activityDetailInfo.status === 2 && activityDetailInfo.endTime < currentTimestamp) {
      console.log('活动状态为已开始，但结束时间已过，疑似数据异常，停止刷新')
      hideLoading()
      return
    }

    const targetTime = activityDetailInfo.status === 1 ? activityDetailInfo.startTime : activityDetailInfo.endTime

    const diff = targetTime - currentTimestamp
    if (diff <= 0) {
      getActivityDetail()
      return
    }

    const d = Math.floor(diff / 1000 / 60 / 60 / 24)
    const h = Math.floor((diff / 1000 / 60 / 60) % 24)
    const m = Math.floor((diff / 1000 / 60) % 60)
    const s = Math.floor((diff / 1000) % 60)
    setTimeMap({
      d: d < 10 ? '0' + d : '' + d,
      h: h < 10 ? '0' + h : '' + h,
      m: m < 10 ? '0' + m : '' + m,
      s: s < 10 ? '0' + s : '' + s,
    })
    // 倒计时首次执行完毕后且请求已结束时，隐藏 loading
    if (!loading && !countdownStarted && isFirstLoad.current === false) {
      // 如果是第一次请求，倒计时首次执行完毕后才hideLoading
      hideLoading()
      setCountdownStarted(true)
    }
  }, [
    currentTimestamp,
    activityDetailInfo?.startTime,
    activityDetailInfo?.endTime,
    activityDetailInfo?.status,
    loading,
    countdownStarted,
  ])

  // 活动产品列表
  const [goodsList, setGoodsList] = useState([])

  const getActivityDetail = () => {
    setLoading(true)
    setRequestFailed(false)
    showLoading({
      title: intl.formatMessage({ id: 'teamLeader.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    const params: any = { activityId: Number(activityId) }
    getMarketingMobileCbgTeamLeaderActivityInfo(params)
      .then((res) => {
        if (res.code === 1000) {
          let data = res.data
          setActivityDetailInfo(data)
          setGoodsList(data.goodsList)
          getProductListBySkuIds(data.goodsList || [])
          setRequestFailed(false)
          if (isFirstLoad.current && data.status !== 3) {
            // 等倒计时去 hideLoading
            setCountdownStarted(false)
          } else {
            // 直接隐藏
            hideLoading()
          }
        } else {
          // 请求失败，设置失败标志, 避免倒计时一直请求
          setRequestFailed(true)
          showToast({
            title:
              res.message || intl.formatMessage({ id: 'teamLeader.huoqushujushibai', defaultMessage: '获取数据失败' }),
            icon: 'none',
          })
          hideLoading()
        }
      })
      .finally(() => {
        setLoading(false)
        if (isFirstLoad.current) {
          // 第一次加载完成后，将标记置为false
          isFirstLoad.current = false
        }
        // hideLoading()
      })
  }

  const TEAMLEADER_DELIVERY_TYPE_ENUM = {
    /**
     * 物流
     */
    LOGISTICS: 1,
    /**
     * 自提
     */
    SELF_PICKUP: 2,
    /**
     * 物流+自提
     */
    LOGISTICS_AND_SELF: 3,
    /**
     * 无须配送
     */
    NO_DELIVERY: 4,
  }

  const TEAMLEADER_DELIVERY_TYPE_TEXT: { [key: number]: string } = {
    [TEAMLEADER_DELIVERY_TYPE_ENUM.LOGISTICS]: intl.formatMessage({
      id: 'teamLeader.DELIVERY_TYPE_LOGISTICS',
      defaultMessage: '物流',
    }),
    [TEAMLEADER_DELIVERY_TYPE_ENUM.SELF_PICKUP]: intl.formatMessage({
      id: 'teamLeader.DELIVERY_TYPE_SELF_PICKUP',
      defaultMessage: '自提',
    }),
    [TEAMLEADER_DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF]: intl.formatMessage({
      id: 'teamLeader.DELIVERY_TYPE_LOGISTICS_AND_SELF',
      defaultMessage: '物流+自提',
    }),
    [TEAMLEADER_DELIVERY_TYPE_ENUM.NO_DELIVERY]: intl.formatMessage({
      id: 'teamLeader.DELIVERY_TYPE_NO_DELIVERY',
      defaultMessage: '无须配送',
    }),
  }

  // 分享页面
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      return {
        title: activityDetailInfo.name,
        // 参数： 活动id 团长id 分享状态
        path: `/packages/communityGroupBuy/pages/activityDetail/index?activityId=${activityId}&pickupPointId=${activityDetailInfo?.pickupPointResp?.teamLeaderId}&shareStatus=1`,
      }
    }
    return {}
  })

  // 点击商品跳转商品详情
  const handleClickProduct = (product) => {
    console.log(product)
    // Router.navigateTo('communityGroupBuy/productDetail', {
    //   commodityId: product.productId,
    // })
  }

  // 存储商品SKU
  const [skuListMap, setSkuListMap] = useState<any>({})
  // 根据skuId集合获取商品SKU
  const getProductListBySkuIds = (goodsList: any[]) => {
    let skuPriceMap = {}
    goodsList.forEach((item) => {
      item.skuList.forEach((sku) => {
        skuPriceMap[sku.skuId] = sku
      })
    })
    let skuIds = Object.keys(skuPriceMap).map(Number)
    if (!skuIds.length) return
    postProductMobileCommodityGetSkuBySkuIdList({ idList: skuIds }).then((res) => {
      if (res.code === 1000) {
        let commodityMap = res.data
        const newCommodityMap = buildProductSkuMap(goodsList, commodityMap)
        setSkuListMap(newCommodityMap)
      }
    })
  }
  const buildProductSkuMap = (goodsList: any[], skuListMap: any) => {
    const allSkuDetails = (Object.values(skuListMap) as any[]).reduce((acc: any[], curr: any) => acc.concat(curr), [])
    const productSkuMap: Record<number, any[]> = {}
    goodsList.forEach((good) => {
      const { productId, productName, productImgUrl, category, brand, skuList } = good
      if (!productSkuMap[productId]) {
        productSkuMap[productId] = []
      }
      skuList.forEach((sku: any) => {
        const skuDetails = allSkuDetails.find((item: any) => item.id === sku.skuId)
        const combinedSku = {
          ...sku,
          ...(skuDetails || {}),
          // 统一添加商品元信息到每个 SKU 上
          productId,
          productName,
          productImgUrl,
          category,
          brand,
          commodityPic: skuDetails?.commodityPic || [],
          stockCount: skuDetails?.stockCount ?? null,
          upperCommoditySkuId: skuDetails?.upperCommoditySkuId ?? null,
          unitPrice: skuDetails?.unitPrice ?? {},
          stockNum: sku?.stockNum ?? 0,
          mainPic: productImgUrl ?? '',
          img: skuDetails?.commodityPic[0] ?? '',
        }
        productSkuMap[productId].push(combinedSku)
      })
    })
    return productSkuMap
  }

  // 商品信息
  const [productInfo, setProductInfo] = useState<any>({
    id: 0,
    name: '',
    originalPrice: '',
    mainPic: '',
    unitName: '',
  })
  const [productSkuList, setProductSkuList] = useState<any[]>([])
  // sku列表（规范后，带unit、reward）
  const [skuList, setSkuList] = useState<SkuListItemType[]>([])
  const [currentSku, setCurrentSku] = useState<SkuListItemType>({
    skuId: 0,
    price: 0,
    stockNum: 0,
    quantity: 0,
    specNames: [],
    unit: '', // 新增，单位
    reward: 0, // 新增，返利
  })
  // 弹窗可见状态
  const [visibleSkuPopup, setVisibleSkuPopup] = useState(false)
  // 弹窗 ref
  const skuPopupRef = useRef<SkuPopupRefHandle | null>(null)

  const skuGroups = useMemo(() => normalizeSpecGroups(productSkuList as any), [productSkuList])

  const handleVisibleSkuPopup = (flag?: boolean) => {
    setVisibleSkuPopup(!!flag)
  }

  const handleSkuChange = (v) => {
    setCurrentSku(v)
  }

  const handleAddProduct = (product) => {
    const {
      productId,
      currentSku: { skuId },
    } = product
    const _skuList = skuListMap[productId] || []
    setProductSkuList(_skuList)
    // 调用 normalizeSpecSkuList 规范数据
    let skuListData = normalizeSpecSkuList(_skuList as any, 1, PRICE_TYPE_ENUM.SPOT)
    // 合并 unit 和 reward 字段
    skuListData = skuListData.map((sku) => {
      const originSku = _skuList.find((item) => item.id === sku.skuId) || {}
      return {
        ...sku,
        unit: originSku.unit || '',
        stockNum: originSku.stockNum ?? 0,
        reward: originSku.reward ?? 0,
        mainPic: originSku.mainPic ?? '',
        img: originSku?.img ?? '',
      }
    })
    setSkuList(skuListData)
    let _currentSku = skuListData.find((item) => item.skuId === skuId)
    if (!_currentSku) {
      _currentSku = skuListData[0]
    }
    setCurrentSku(_currentSku)
    setVisibleSkuPopup(true)
  }

  useEffect(() => {
    if (!currentSku.skuId) return
    const targetItem = productSkuList.find((item) => item.id === currentSku.skuId)
    if (targetItem) {
      setProductInfo((prev) => ({
        ...prev,
        id: targetItem.productId,
        name: targetItem.productName,
        activePrive: targetItem.activityPrice,
        originalPrice: targetItem.price,
        mainPic: targetItem.commodityPic?.[0] || '',
        unitName: targetItem.unit,
      }))
    }
  }, [currentSku, productSkuList])

  const handleBack = () => {
    if (shareStatus) {
      jmpHome()
    } else {
      // 正常返回
      Router.navigateBack()
    }
  }

  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }

  // 报名活动
  const handleActivityAction = async () => {
    if (!userInfo) {
      handleJumpLogin()
      return
    }
    FullScreenLoading.show()
    try {
      const id = activityDetailInfo.id
      const status = activityDetailInfo.signupStatus
      // 报名活动状态（1：已报名）
      if (status !== 1) {
        // 报名
        const res = await postMarketingMobileCbgTeamLeaderSignUpActivity({ activityId: id })
        if (res.code === 1000) {
          showToast({
            title: res.message || intl.formatMessage({ id: 'teamLeader.baomingchenggong', defaultMessage: '报名成功' }),
            icon: 'none',
          })
          // 报名成功-手动更新activityList中对应项状态
          setActivityDetailInfo((prev) => ({ ...prev, signupStatus: 1 }))
        } else {
          showToast({
            title: res.message || intl.formatMessage({ id: 'teamLeader.baomingshibai', defaultMessage: '报名失败' }),
            icon: 'none',
          })
        }
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.qingqiuyichangqingshaohouzaishi',
          defaultMessage: '请求异常，请稍后再试',
        }),
        icon: 'none',
      })
    } finally {
      FullScreenLoading.hide()
    }
  }

  const tagStyle = {
    video: 'width: 100%;',
  }

  const handleRichChange = useCallback((e) => {
    const html = e.detail?.html
    console.log('html', html)
    const params = {
      activityId: activityId,
      customDetail: html,
    }
    FullScreenLoading.show()
    postMarketingMobileCbgTeamLeaderSaveCustomActivityDetail(params)
      .then((res) => {
        if (res.code === 1000) {
          setIsEditing(false)
          showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
          setTimeout(() => {
            getActivityDetail()
          }, 800)
        } else {
          showToast({
            title: res.message || intl.formatMessage({ id: 'teamLeader.baomingshibai', defaultMessage: '报名失败' }),
            icon: 'none',
            duration: 1500,
          })
        }
      })
      .finally(() => {
        FullScreenLoading.hide()
      })
  }, [])

  // 父组件触发上传逻辑
  const handleRichUpload = async () => {
    const chooseRes = await Taro.chooseImage({ count: 1 })
    const localPath = chooseRes.tempFilePaths[0]
    console.log('localPath', localPath)
    const result = await uploadFileRequest([{ path: localPath }])
    const url = result?.[0]?.url

    if (url) {
      const page = Taro.getCurrentPages().slice(-1)[0] // 当前页面实例
      const editorComp = page?.selectComponent('#richEditor') // 获取 rich 组件实例
      if (editorComp) {
        editorComp.insertImageFromParent(url) // 调用组件里的方法
      } else {
        console.warn('富文本组件实例获取失败')
      }
    }
  }

  return (
    <View className={styles['container']}>
      <View className={styles['top']}>
        <Image className={styles['top-image']} src={activityDetailInfo?.picture} mode="aspectFit" />
        {activityDetailInfo.signupStatus === 1 && (
          <View className={styles['top-share']}>
            <Button openType="share" className={styles['top-share-btn']}>
              <Image className={styles['top-share-icon']} src={shareIcon} />
              <Text className={styles['top-share-text']}>
                {intl.formatMessage({ id: 'teamLeader.fenxiang', defaultMessage: '分享' })}
              </Text>
            </Button>
          </View>
        )}
      </View>
      <NavBar
        back={handleBack}
        customClassName={styles.navbar}
        customStyle={`background: ${navBgColor};height: ${navHeight};`}
      />
      <View
        className={styles['activity-status']}
        style={{ top: navHeight, background: navBgColor, marginTop: pxTransform(-4) }}
      >
        <View
          className={cs(
            styles['activity-status-content'],
            activityDetailInfo?.status === 3 && styles['activity-status-content-end'],
          )}
        >
          <View className={styles['team-leader']}>
            {intl.formatMessage({ id: 'teamLeader.tuanzhang', defaultMessage: '团长' })}：
            {activityDetailInfo?.pickupPointResp?.name}
          </View>
          {activityDetailInfo?.status === 3 ? (
            <View className={styles['activity-status-content-end-tag']}>
              {intl.formatMessage({ id: 'teamLeader.yijieshu', defaultMessage: '已结束' })}
            </View>
          ) : (
            <View className={styles['activity-status-content-time']}>
              <View className={styles['ml-4']}>
                {activityDetailInfo?.status === 2
                  ? intl.formatMessage({ id: 'teamLeader.jujieshu', defaultMessage: '距结束' })
                  : intl.formatMessage({ id: 'teamLeader.jujieshu', defaultMessage: '距开始' })}
              </View>
              <View className={styles['ml-4']}>
                {timeMap.d}
                {intl.formatMessage({ id: 'teamLeader.tian', defaultMessage: '天' })}
              </View>
              <View className={cs(styles['ml-4'], styles['time-tag'])}>{timeMap.h}</View>
              <View className={styles['ml-4']} style={{ fontSize: pxTransform(14) }}>
                :
              </View>
              <View className={cs(styles['ml-4'], styles['time-tag'])}>{timeMap.m}</View>
              <View className={styles['ml-4']} style={{ fontSize: pxTransform(14) }}>
                :
              </View>
              <View className={cs(styles['ml-4'], styles['time-tag'])}>{timeMap.s}</View>
            </View>
          )}
        </View>
      </View>
      <View className={styles['container-box']}>
        <View className={styles['container-box-item']}>
          <Text className={cx(styles['container-box-text'], styles['container-box-text-width'])}>
            {intl.formatMessage({ id: 'teamLeader.huodongmigncheng', defaultMessage: '活动名称' })}：
          </Text>
          <Text className={styles['container-box-text2']}>{activityDetailInfo?.name}</Text>
        </View>
        <View className={styles['container-box-item']}>
          <Text className={cx(styles['container-box-text'], styles['container-box-text-width'])}>
            {intl.formatMessage({ id: 'teamLeader.huodongmigncheng', defaultMessage: '活动时间' })}：
          </Text>
          <Text className={styles['container-box-text2']}>
            {formatDateFromTimestamp(activityDetailInfo.startTime, 1)} ～{' '}
            {formatDateFromTimestamp(activityDetailInfo.endTime, 1)}
          </Text>
        </View>
        <View className={styles['container-box-item']}>
          <Text className={cx(styles['container-box-text'], styles['container-box-text-width2'])}>
            {intl.formatMessage({ id: 'teamLeader.tibaohuodongshangjia', defaultMessage: '提报活动商家' })}：
          </Text>
          <Text className={styles['container-box-text2']}>{activityDetailInfo.merchantName}</Text>
        </View>
        <View className={styles['container-box-item']}>
          <Text className={cx(styles['container-box-text'], styles['container-box-text-width'])}>
            {intl.formatMessage({ id: 'teamLeader.huodongzhuangtai', defaultMessage: '活动状态' })}：
          </Text>
          <Text className={styles['container-box-text2']}>
            {activityDetailInfo.status === 1
              ? intl.formatMessage({ id: 'teamLeader.weikaishi', defaultMessage: '未开始' })
              : activityDetailInfo.status === 2
              ? intl.formatMessage({ id: 'teamLeader.jinxingzhong', defaultMessage: '进行中' })
              : intl.formatMessage({ id: 'teamLeader.yijieshu', defaultMessage: '已结束' })}
          </Text>
        </View>
        <View className={styles['container-box-item']}>
          <Text className={cx(styles['container-box-text'], styles['container-box-text-width'])}>
            {intl.formatMessage({ id: 'teamLeader.baomingzhuangtai', defaultMessage: '报名状态' })}：
          </Text>
          <Text className={styles['container-box-tag']}>
            {activityDetailInfo?.signupStatus === 1
              ? intl.formatMessage({ id: 'teamLeader.yibaoming', defaultMessage: '已报名' })
              : intl.formatMessage({ id: 'teamLeader.weibaoming', defaultMessage: '未报名' })}
          </Text>
        </View>
      </View>
      <View className={styles['delivery-goods']}>
        <View className={styles['delivery-goods-title']}>
          {intl.formatMessage({ id: 'teamLeader.tuangouhuodongshangpin', defaultMessage: '团购活动商品' })}
        </View>
        {goodsList.map((item, index) => (
          <ProductCard key={index.toString()} data={item} onClick={handleClickProduct} onAdd={handleAddProduct} />
        ))}
      </View>
      <View className={styles['delivery-info']}>
        <View className={styles['delivery-info-title']}>
          {intl.formatMessage({ id: 'teamLeader.fahuoxinxi', defaultMessage: '发货信息' })}
        </View>
        <View className={cs(styles['delivery-info-item'], styles['inline'], styles['border-bottom'])}>
          <View className={styles['delivery-info-item-label']}>
            {intl.formatMessage({ id: 'teamLeader.peisongfangshi', defaultMessage: '配送方式' })}
          </View>
          <View className={cs(styles['delivery-info-item-value'], styles['inline'])}>
            {TEAMLEADER_DELIVERY_TYPE_TEXT[activityDetailInfo.deliveryType] || ''}
          </View>
        </View>
        <View className={styles['delivery-info-item']}>
          <View className={styles['delivery-info-item-label']}>
            {intl.formatMessage({ id: 'teamLeader.fahuoshuoming', defaultMessage: '发货说明' })}
          </View>
          <View className={styles['delivery-info-item-value']}>{activityDetailInfo?.shippingTimeDescription}</View>
        </View>
      </View>
      <View className={styles['activity-info']}>
        <View className={styles['activity-info-title']}>
          <View className={styles['activity-info-title-text']}>
            {intl.formatMessage({ id: 'teamLeader.huodongxinxi', defaultMessage: '活动信息' })}
          </View>

          {/* 右侧“编辑”按钮 */}
          {Number(enterType) === 1 && activityDetailInfo?.pickupPointResp?.status === 2 ? (
            <View
              className={styles['activity-info-title-edit-btn']}
              onClick={() => {
                setIsEditing((prev) => !prev)
              }}
            >
              {isEditing ? '取消' : '编辑'}
            </View>
          ) : null}
        </View>

        {isEditing ? (
          // 编辑
          <rich
            id="richEditor"
            html={activityDetailInfo?.customDetail || activityDetailInfo?.detail}
            onRichupload={handleRichUpload}
            onRichchange={handleRichChange}
          />
        ) : (
          // 展示态：展示 customDetail 优先，没有则展示 detail
          (activityDetailInfo?.customDetail || activityDetailInfo?.detail) && (
            <parser html={activityDetailInfo?.customDetail || activityDetailInfo?.detail} tag-style={tagStyle} />
          )
        )}
      </View>
      <View className={styles['footer']}>
        <View className={styles['footer-content']}>
          {activityDetailInfo?.signupStatus === 1 ? (
            <View className={cs(styles['footer-content-button'], styles.disabled)}>
              {intl.formatMessage({ id: 'teamLeader.yicanyuhuodong', defaultMessage: '已参与活动' })}
            </View>
          ) : (
            <View className={styles['footer-content-button']} onClick={() => handleActivityAction()}>
              {intl.formatMessage({ id: 'teamLeader.canyutuangouhuodong', defaultMessage: '参与团购活动' })}
            </View>
          )}
        </View>
      </View>
      <View className={styles['footer-holder']} />

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
        onConfirm={() => handleVisibleSkuPopup(false)}
      />

      <FullScreenLoading />
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderGroupBuyDetail))
