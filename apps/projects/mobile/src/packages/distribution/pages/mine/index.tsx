import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Icons, Image, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import cx from 'classnames'
import {
  pxTransform,
  useShareAppMessage,
  getStorageSync,
  showToast,
  showLoading,
  hideLoading,
  getMenuButtonBoundingClientRect,
  systemInfo,
} from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import Filter from '@/components/Filter'
import FilterDrawer from '@/components/FilterDrawer'
import Loading from '@/components/Loading'
import Empty from '@/components/Empty'
import ProductList from '@/components/ProductList'
import { FilterSortBarValue } from '@/components/FilterSortBar'
import { FILTER_BAR_TYPE, FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import {
  getMarketingMobileSocialDistributionStaffHomeData,
  getProductMobileSocialDistributionGoodsPage,
  getProductMobileSocialDistributionGoodsRateRange,
} from '@apps/apis'
import useGetShareQRCodes from '../../hooks/useGetShareQRCodes'
import { useStatusBarHeight } from '@apps/mobile-services'
import { formatMoney, formattedPricePart } from '../../utils/formatter'
import ShareModal from '../../components/ShareModal/invitationShare'
import { USER_INFO } from '@/constants/storage'
import Taro from '@tarojs/taro'
const peopleIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/people-icon.png'
const rewardIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/reward-icon.png'
const logo = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/default_logo.png'
const addShopImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/addshop-img.png'
const invitationImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/invitation.png'

interface ListParams {
  /**
   * 商品名称
   */
  name?: string
}
interface DistributorInfo {
  staffId: number // 分销员ID
  upperMemberName: string // 上级
  levelName: string // 等级
  name: string // 分销员名称
  logo: string // 分销员LOGO
  status: number // 分销员状态 0-禁用 1-启用
  enableDistributionActivity: number // 是否启用分销活动 0-禁用 1-启用
  invitationCode: string // 邀请码
  downlineDistributorCount: number // 下级分销员数量
  directDistributionOrderCount: number // 直接分销订单数
  directDistributionSalesAmount: number // 直接分销销售额
  indirectDistributionOrderCount: number // 间接分销订单数
  indirectDistributionSalesAmount: number // 间接分销销售额
  directPendingSettlementAmount: number // 直接未入账分销佣金
  indirectPendingSettlementAmount: number // 间接未入账分销佣金
  directProductRateMin: number // 直接返现比例最小值
  directProductRateMax: number // 直接返现比例最大值
  indirectCommissionRate: number // 邀请分销返现比例
  curCommissionRate: number
  upperCommissionRate: number
  shareImage: string // 邀请分销分享背景图
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      poster: any
    }
  }
}
const MinePage = () => {
  const intl = useIntl()
  const [distributorInfo, setDistributorInfo] = useState<DistributorInfo | null>(null)
  const [list, setList] = useState<any[]>([])
  const filterBarConfig = [FILTER_BAR_TYPE.defaultdSort, FILTER_BAR_TYPE.rewardSort, FILTER_BAR_TYPE.priceSort]
  const multiple = true
  const [sortParam, setSortParam] = useState({})
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const pageSize = 10
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const searchValue = useRef<ListParams>({})
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const stickyRef = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [shareType, setShareType] = useState<number>(1)
  const [imgBgSrc, setImgBgSrc] = useState('')
  const [imgCodeSrc, setImgCodeSrc] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [inviterAccount, setInviterAccount] = useState('')
  const [isInitDone, setIsInitDone] = useState(false)
  const posterRef = useRef()
  const [downloadTrigger, setDownloadTrigger] = useState(0)

  const canvasWidth = 327
  const canvasHeight = 490

  const [menuRect, setMenuRect] = useState<Taro.getMenuButtonBoundingClientRect.Rect>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  })
  const { statusBarHeight } = useStatusBarHeight()
  const getMenuRect = () => {
    const res = getMenuButtonBoundingClientRect()
    setMenuRect(res)
  }
  const navHeight = statusBarHeight + menuRect.height + (menuRect.top - statusBarHeight) * 2
  const scrollHeight = systemInfo.screenHeight - navHeight
  // const headerHeight = navHeight + 40
  const headerHeight = navHeight

  useEffect(() => {
    const init = async () => {
      await getDistributorInfo()
      await getGoodsRateRange()
      getMenuRect()
      const tempParam: Partial<FILTER_PARAM> = {}
      if (multiple) {
        tempParam[FILTER_PARAM_KEY.brandIdList] = []
        tempParam[FILTER_PARAM_KEY.categoryIdList] = []
      } else {
        tempParam[FILTER_PARAM_KEY.brandId] = ''
        tempParam[FILTER_PARAM_KEY.categoryId] = ''
      }
      if (Object.keys(tempParam).length > 0) {
        setFilterParam(tempParam as FILTER_PARAM)
      }

      setIsInitDone(true)
    }
    init()
  }, [])

  // 获取分享二维码自动触发hook
  const pages = [
    {
      key: 'shop',
      pagePath: 'packages/distribution/pages/addShop/index',
      // 传邀请人账号,商城属性,是否为自营商城
      getScene: ({ account }) => `a=${account}`,
      requiredParams: ['account'] as const,
    },
    {
      key: 'invite',
      pagePath: 'packages/distribution/pages/invitation/index',
      // 传邀请码,商城属性,是否为自营商城
      getScene: ({ code }) => `c=${code}`,
      requiredParams: ['code'] as const,
    },
  ]

  const ready = !!invitationCode && !!inviterAccount

  const { qrMap, qrLoading } = useGetShareQRCodes({
    ...(ready ? { code: invitationCode, account: inviterAccount } : {}),
    pages,
  })

  const handlePosterSuccess = (e) => {
    const tempFilePath = e.detail
    console.log('海报生成成功', tempFilePath)
    Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        Taro.showToast({ title: '保存成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('保存失败', err)
        Taro.showToast({ title: '保存失败', icon: 'error' })
      },
    })
  }

  // 获取分销员信息
  const getDistributorInfo = async () => {
    try {
      const res = await getMarketingMobileSocialDistributionStaffHomeData()
      if (res.code === 1000) {
        const info = res.data
        setDistributorInfo(info)
        // 获取邀请码
        setInvitationCode(info.invitationCode)
        // 获取缓存中账户信息
        const userInfoStr = getStorageSync(USER_INFO)
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          // 邀请人账号
          setInviterAccount(userInfo.account)
        }
      } else {
        showToast({
          title:
            res.message ||
            intl.formatMessage({
              id: 'distribution.huoqushujushibai',
              defaultMessage: '获取数据失败',
            }),
          icon: 'none',
        })
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'distribution.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    }
  }

  const backPage = () => {
    Router.navigateTo('extra/mine')
  }

  // 获取分销产品佣金比例范围
  // 返现比例最大值
  const directProductRateMax = useRef(0)
  // 返现比例最小值
  const directProductRateMin = useRef(0)
  const getGoodsRateRange = async () => {
    const res = await getProductMobileSocialDistributionGoodsRateRange()
    if (res.code === 1000) {
      directProductRateMax.current = res.data.directProductRateMax * 100
      directProductRateMin.current = res.data.directProductRateMin * 100
    }
  }

  // 跳转返现明细
  const toReward = () => {
    const infos = {
      // 直接分销销售额
      directDistributionSalesAmount: distributorInfo?.directDistributionSalesAmount,
      // 直接未入账分销佣金
      directPendingSettlementAmount: distributorInfo?.directPendingSettlementAmount,
      // 间接分销销售额
      indirectDistributionSalesAmount: distributorInfo?.indirectDistributionSalesAmount,
      // 间接未入账分销佣金
      indirectPendingSettlementAmount: distributorInfo?.indirectPendingSettlementAmount,
    }
    Router.navigateTo('distribution/reward', infos)
  }
  // 跳转邀请的分销员列表
  const toInviteList = () => {
    Router.navigateTo('distribution/list')
  }

  // 获取分销商品列表
  const getProductList = async (isRefresh = false) => {
    if (loading) return
    setLoading(true)
    if (isRefresh) {
      setPageNo(1)
      setHasMore(true)
    }
    showLoading({
      title: intl.formatMessage({ id: 'distribution.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    try {
      const payload: any = {
        ...(searchValue.current || {}),
        ...filterParam,
        current: String(isRefresh ? 1 : pageNo),
        pageSize: String(pageSize),
      }
      // 判断 sortParam 排序是否为空对象
      if (sortParam && Object.keys(sortParam).length > 0) {
        if ((sortParam as any).orderType === 1) {
          // 预估返利升序
          payload.estimatedCommissionOrderBy = 'asc'
        } else if ((sortParam as any).orderType === 2) {
          // 预估返利降序
          payload.estimatedCommissionOrderBy = 'desc'
        } else if ((sortParam as any).orderType === 3) {
          // 价格升序
          payload.priceOrderBy = 'asc'
        } else if ((sortParam as any).orderType === 4) {
          // 价格降序
          payload.priceOrderBy = 'desc'
        }
      }
      const res = await getProductMobileSocialDistributionGoodsPage(payload)
      hideLoading()
      if (res.code === 1000) {
        const data = res.data?.data || []
        const total = res.data?.totalCount || 0
        const newList = isRefresh ? data : [...list, ...data]
        setList(newList)
        setPageNo(isRefresh ? 2 : pageNo + 1)
        setHasMore(newList.length < total)
      } else {
        showToast({
          title:
            res.message ||
            intl.formatMessage({
              id: 'distribution.huoqushujushibai',
              defaultMessage: '获取数据失败',
            }),
          icon: 'none',
        })
      }
    } catch (error) {
      hideLoading()
      showToast({
        title: intl.formatMessage({
          id: 'distribution.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    } finally {
      setLoading(false)
      if (isRefresh) setRefreshing(false)
    }
  }

  const handleSearch = (keyword: string) => {
    if (loading) {
      return
    }

    searchValue.current = {
      name: keyword,
    }
    getProductList(true)
  }

  // 保留两位小数
  const formatNoRound = (val: number): string => {
    if (isNaN(val)) return '0.00'
    return val.toFixed(2)
  }

  useEffect(() => {
    // 获取分销员信息后，再根据sortParam和filterParam 拉取商品获取分销商品列表
    if (isInitDone) {
      getProductList(true)
    }
  }, [sortParam, filterParam, isInitDone])

  const handleVisibleFilterDrawer = (flag?: boolean) => {
    setVisibleFilterDrawer(!!flag)
  }
  const handleSortChange = (values: FilterSortBarValue) => {
    const param: any = {}
    // 排序方式：1-销量从高到低,2-信用从高到低,3-价格从高到低,4-价格从低到高
    if (values.rewardSort) {
      if (values.rewardSort === 'ASC') {
        param.orderType = 1
      } else if (values.rewardSort === 'DESC') {
        param.orderType = 2
      }
    } else if (values.priceSort) {
      if (values.priceSort === 'ASC') {
        param.orderType = 3
      } else if (values.priceSort === 'DESC') {
        param.orderType = 4
      }
    }
    setSortParam(param)
  }
  const handleFilterChange = (values: any) => {
    const newValues = { ...values }
    if (newValues.min === 0) {
      newValues.min = ''
    }
    if (newValues.max === 0) {
      newValues.max = ''
    }
    setFilterParam(newValues)
  }

  const handleRefresh = async () => {
    // 避免重复刷新
    if (refreshing) return
    setRefreshing(true)
    try {
      await getProductList(true)
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleLoadMore = async () => {
    if (loading || !hasMore) return
    await getProductList(false)
  }

  // 滚动监听
  Taro.usePageScroll(() => {
    const threshold = 2 // 可容忍 2px 的浮点误差
    const query = Taro.createSelectorQuery()
    query.select('#stickyRef').boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        setIsSticky(res[0].top <= navHeight + threshold)
      }
    })
  })

  const shareModalHandle = (type: number) => {
    // 需修改为对方图片路径
    const img = type === 1 ? `${addShopImg}` : `${distributorInfo?.shareImage || invitationImg}`
    const code = type === 1 ? `${qrMap.shop}` : `${qrMap.invite}`
    setShareType(type)
    setImgBgSrc(img)
    setImgCodeSrc(code)
    setShareModalVisible(true)
  }

  // 分享页面
  // 微信分享
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      const title = shareType === 1 ? '邀您加入商城' : '邀请您成为分销员'
      // 邀请加入商城页面路径
      const addShopPath = `/packages/distribution/pages/addShop/index?a=${inviterAccount}`
      // 邀请成为分销员页面路径
      const invitationPath = `/packages/distribution/pages/invitation/index?c=${invitationCode}`
      const path = shareType === 1 ? addShopPath : invitationPath
      return {
        title: title,
        path: `${path}`,
      }
    }
    return {}
  })

  // 保存图片
  const handleSaveImage = () => {
    Taro.getSetting({
      success(res) {
        const hasPermission = res.authSetting['scope.writePhotosAlbum']
        if (hasPermission) {
          // 已授权
          setDownloadTrigger((prev) => prev + 1)
        } else {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 已授权
              setDownloadTrigger((prev) => prev + 1)
            },
          })
        }
      },
    })
  }

  // 根据商品sku集合获取最小及最大佣金比例范围
  const getCommissionRateRange = (list: { commissionRate: number; price: number }[]): string => {
    // 上级分销员等级佣金比例
    const upperCommissionRate = distributorInfo?.upperCommissionRate
    // 当前分销员等级佣金比例
    const curCommissionRate = distributorInfo?.curCommissionRate

    const hasUpper = typeof upperCommissionRate === 'number' && !isNaN(upperCommissionRate)
    const rates = list
      // 过滤无效项
      .filter((item) => !isNaN(item.commissionRate) && !isNaN(item.price))
      // 计算每一项返利
      .map((item) => {
        let commission = item.price * item.commissionRate * curCommissionRate
        if (hasUpper) {
          commission *= 1 - upperCommissionRate!
        }
        return commission
      })
    if (rates.length === 0) return '0'
    // 返回一组数中的最小值
    const min = Math.min(...rates)
    // 返回一组数中的最大值
    const max = Math.max(...rates)
    const minStr = formatNoRound(min)
    const maxStr = formatNoRound(max)
    return min === max ? `${minStr}` : `${minStr} - ${maxStr}`
  }

  const toGoods = (item: any) => {
    const params = {
      // 商品id
      commodityId: item.commodityId,
      // 邀请码
      invitationCode: invitationCode,
    }
    Router.navigateTo('distribution/goods', params)
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View className={styles['product-box']} key={index} onClick={() => toGoods(item)}>
        <Image src={item.productImgUrl} className={styles['product-box-img']}></Image>
        <View className={styles['product-box-info']}>
          <View>
            <View className={styles['product-box-info-name']}>{item.productName}</View>
            {/* 卖点 */}
            {item?.sellingPoint && item?.sellingPoint.length > 0 && (
              <View className={styles['product-box-info-desc']}>
                {item.sellingPoint.map((point, idx) => (
                  <Text key={idx}>{point}</Text>
                ))}
              </View>
            )}
            {/* 标签 */}
            {item?.tagList && item?.tagList.length > 0 ? (
              <View className={styles['product-box-info-tags']}>
                {item.tagList.map((tag, idx) => (
                  <Text
                    className={styles['product-box-info-tags-item']}
                    style={{
                      color: tag === '社区团购' ? '#04ad71' : undefined,
                      borderColor: tag === '社区团购' ? '#04ad71' : undefined,
                    }}
                    key={idx}
                  >
                    {tag}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          <View className={styles['product-box-info-price']}>
            <View className={styles['product-box-info-price-info']}>
              <Text className={styles['product-box-info-price-info-symbol']}>
                {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
              </Text>
              <Text className={styles['product-box-info-price-info-value']}>{formattedPricePart(item.price, 1)}</Text>
              <Text className={styles['product-box-info-price-info-decimal']}>
                .{formattedPricePart(item.price, 2)}
              </Text>
              <Text className={styles['product-box-info-price-info-unit']}>/ {item.unit}</Text>
            </View>
            {item?.socialDistributionRespList && item?.socialDistributionRespList.length > 0 && (
              <View className={styles['product-box-info-price-reward']}>
                <Text className={styles['product-box-info-price-reward-title']}>
                  {intl.formatMessage({ id: 'yugufanli', defaultMessage: '预估返利' })}
                </Text>
                <Text className={styles['product-box-info-price-reward-value']}>
                  {getCommissionRateRange(item.socialDistributionRespList)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles['page']} style={{ paddingTop: pxTransform(5 + navHeight) }}>
      <View className={styles['bg-view']} style={{ display: isSticky ? 'none' : 'block' }}></View>

      <NavBar
        customRenderLeft={
          <View style={{ flex: 0.7 }}>
            <Icons name="ChevronLeft" size={24} color={isSticky ? '#ffffff' : '#ffffff'} onClick={() => backPage()} />
          </View>
        }
        customClassName={styles['header-nav']}
        title={
          <Search
            onSearch={handleSearch}
            placeholder={intl.formatMessage({
              id: 'search.qingshurushangpinmingcheng',
              defaultMessage: '请输入商品名称',
            })}
            customLeftIcon={<Icons name="Search" size={18} color={isSticky ? '#ffffff' : '#ffffff'} />}
            customClassName={styles[isSticky ? 'top-search' : 'top-search']}
            customPlaceholderClass={styles[isSticky ? 'search-field-placeholder' : 'search-field-placeholder']}
            customSearchFieldClass={isSticky ? 'search-input-dark' : 'search-input-dark'}
            // customSearchFieldClass={styles['search-field']}
            innerBackground={isSticky ? '#0000001a' : '#0000001a'}
            shape="round"
            clearable
          />
        }
      />

      <View className={styles['contains']}>
        <View className={styles['box']}>
          <View className={styles['company']}>
            <View className={styles['company-box']}>
              <Image src={distributorInfo?.logo || logo} className={styles['company-logo']}></Image>
              <View className={styles['company-info']}>
                <View className={styles['company-info-name']}>{distributorInfo?.name}</View>
                <View className={styles['company-info-tips']}>
                  {intl.formatMessage({ id: 'distibution.mine.wodeshangji', defaultMessage: '我的上级：' })}
                  {distributorInfo?.upperMemberName || '无'}
                </View>
              </View>
            </View>

            <View className={styles['company-tag']}>{distributorInfo?.levelName}</View>
          </View>
        </View>

        <View className={styles['box']}>
          <View className={styles['box-header']}>
            <View className={styles['box-header-title']}>
              {intl.formatMessage({
                id: 'distribution.mine.wodefanxian',
                defaultMessage: '我的返现',
              })}
            </View>
            <View className={styles['box-header-right']} onClick={() => toReward()}>
              <Text>
                {intl.formatMessage({
                  id: 'distribution.mine.fanxianmingxi',
                  defaultMessage: '返现明细',
                })}
              </Text>
              <Icons name="ChevronRight" size={12} color="#5C626A" />
            </View>
          </View>

          <View className={styles['cashback']}>
            <View className={styles['cashback-box']}>
              <View className={styles['cashback-box-item']}>
                <View>
                  {intl.formatMessage({
                    id: 'distribution.mine.zhijiefenxiaofanxiandaozhang',
                    defaultMessage: '直接分销返现到账(元)',
                  })}
                </View>
                <View className={styles['cashback-box-item-money']}>
                  {formatMoney(distributorInfo?.directDistributionSalesAmount)}
                </View>
                <View style={{ marginTop: pxTransform(16) }}>
                  {intl.formatMessage({
                    id: 'distribution.mine.daijiesuanweidaozhang',
                    defaultMessage: '待结算未到账(元)',
                  })}
                </View>
                <View className={styles['cashback-box-item-price']}>
                  {formatMoney(distributorInfo?.directPendingSettlementAmount)}
                </View>
              </View>

              <View className={styles['cashback-box-item']}>
                <View>
                  {intl.formatMessage({
                    id: 'distribution.mine.yaoqingfenxiaofanxiandaozhang',
                    defaultMessage: '邀请分销返现到账(元)',
                  })}
                </View>
                <View className={styles['cashback-box-item-money']}>
                  {formatMoney(distributorInfo?.indirectDistributionSalesAmount)}
                </View>
                <View style={{ marginTop: pxTransform(16) }}>
                  {intl.formatMessage({
                    id: 'distribution.mine.daijiesuanweidaozhang',
                    defaultMessage: '待结算未到账(元)',
                  })}
                </View>
                <View className={styles['cashback-box-item-price']}>
                  {formatMoney(distributorInfo?.indirectPendingSettlementAmount)}
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className={styles['stat-box']}>
          <View className={styles['stat-box-item']}>
            <Image src={rewardIcon} className={styles['stat-box-item-icon']}></Image>
            <View className={styles['stat-box-item-info']} onClick={() => toReward()}>
              <View className={styles['stat-box-item-info-num']}>
                {formatMoney(
                  (distributorInfo?.directDistributionSalesAmount || 0) +
                    (distributorInfo?.indirectDistributionSalesAmount || 0),
                )}
              </View>
              <View className={styles['flex-row']}>
                <Text style={{ marginRight: pxTransform(4) }}>
                  {intl.formatMessage({
                    id: 'distribution.mine.leijifanxian',
                    defaultMessage: '累计返现(元)',
                  })}
                </Text>
                <Icons name="ChevronRight" size={12} color="#91959b" />
              </View>
            </View>
          </View>

          <View className={styles['stat-box-item']}>
            <Image src={peopleIcon} className={styles['stat-box-item-icon']}></Image>
            <View className={styles['stat-box-item-info']} onClick={() => toInviteList()}>
              <View className={styles['stat-box-item-info-num']}>{distributorInfo?.downlineDistributorCount || 0}</View>
              <View className={styles['flex-row']}>
                <Text style={{ marginRight: pxTransform(4) }}>
                  {intl.formatMessage({
                    id: 'distribution.mine.xiajifenxiaoyuan',
                    defaultMessage: '下级分销员(人)',
                  })}
                </Text>
                <Icons name="ChevronRight" size={12} color="#91959b" />
              </View>
            </View>
          </View>
        </View>

        {/* 分销员状态正常并且分销活动是启用状态，才展示邀请及商品信息 */}
        {distributorInfo?.status === 1 && distributorInfo?.enableDistributionActivity === 1 && (
          <>
            <View className={styles['box']}>
              <View className={styles['box-header']}>
                <View className={styles['box-header-title']}>
                  {intl.formatMessage({
                    id: 'distribution.mine.fenxiaojili',
                    defaultMessage: '分销激励',
                  })}
                </View>
              </View>

              <View className={styles['motivate-box']}>
                <View className={styles['motivate-box-info']}>
                  <View className={styles['motivate-box-info-title']}>
                    {intl.formatMessage({
                      id: 'distribution.mine.zhijiefenxiaofanxian',
                      defaultMessage: '直接分销返现',
                    })}
                  </View>
                  <View>
                    {intl.formatMessage({
                      id: 'distribution.mine.yaoqinghaoyouxiadantuiguangshangpin',
                      defaultMessage: '邀请好友下单推广商品，获得',
                    })}
                    {directProductRateMin.current}~{directProductRateMax.current}%
                    {intl.formatMessage({
                      id: 'distribution.mine.fenxiaoshangpinfanxian',
                      defaultMessage: '的分销商品返现',
                    })}
                  </View>
                </View>
                <View className={styles['motivate-box-share']} onClick={() => shareModalHandle(1)}>
                  {intl.formatMessage({
                    id: 'distibution.mine.lijifenxiang',
                    defaultMessage: '立即分享',
                  })}
                </View>
              </View>

              <View className={styles['motivate-box']}>
                <View className={styles['motivate-box-info']}>
                  <View className={styles['motivate-box-info-title']}>
                    {intl.formatMessage({
                      id: 'distribution.mine.yaoqingfenxiaofanxian',
                      defaultMessage: '邀请分销返现',
                    })}
                  </View>
                  <View>
                    {intl.formatMessage({
                      id: 'distribution.mine.yaoqinghaoyouchengweixiajifenxiaoyuan',
                      defaultMessage: '邀请好友成为下级分销员，额外获得',
                    })}
                    {distributorInfo?.indirectCommissionRate}%
                    {intl.formatMessage({
                      id: 'distribution.mine.fenxiaoyaoqingfanxian',
                      defaultMessage: '分销邀请返现',
                    })}
                  </View>
                </View>
                <View className={styles['motivate-box-share']} onClick={() => shareModalHandle(2)}>
                  {intl.formatMessage({
                    id: 'distibution.mine.lijiyaoqing',
                    defaultMessage: '立即邀请',
                  })}
                </View>
              </View>
            </View>

            <View className={styles['dividing']}>
              <Text>--</Text>
              <Text className={styles['dividing-text']}>
                {intl.formatMessage({
                  id: 'distibution.mine.tuiguangshangpin',
                  defaultMessage: '推广商品',
                })}
              </Text>
              <Text>--</Text>
            </View>

            <View
              style={{ position: 'sticky', top: pxTransform(navHeight), zIndex: 99 }}
              ref={stickyRef}
              id="stickyRef"
            >
              <Filter
                config={filterBarConfig}
                onChange={handleSortChange}
                extra={[
                  <ProductList.SwitchButton key="1" />,
                  <View key="2" onClick={() => handleVisibleFilterDrawer(true)}>
                    <Text className="filter-extra-item-name">
                      {intl.formatMessage({
                        id: 'search.shaixuan',
                        defaultMessage: '筛选',
                      })}
                    </Text>
                    <Icons className="filter-extra-item-icon" name="Filter" size={16} />
                  </View>,
                ]}
              />
            </View>

            <View className={styles['product-list']} style={`height: ${scrollHeight + 'PX'};`}>
              <ScrollView
                scrollY={isSticky}
                showScrollbar={false}
                data={list}
                // refresherEnabled
                // refresherTriggered={refreshing}
                // onRefresherRefresh={handleRefresh}
                onScrollToLower={handleLoadMore}
                lowerThreshold={80}
                className={styles['product-list-scroll']}
                renderItem={renderItem}
                listEmptyComponent={<Empty />}
                listFooterComponent={
                  list.length ? (
                    <Loading loading={loading} noMore={!hasMore} customStyle={{ marginTop: pxTransform(12) }} />
                  ) : null
                }
              />
            </View>
          </>
        )}

        <FilterDrawer
          visible={visibleFilterDrawer}
          filterParam={filterParam}
          multiple={multiple}
          onClose={() => handleVisibleFilterDrawer(false)}
          offsetTop={headerHeight}
          onChange={handleFilterChange}
        />
      </View>

      {/* 分享modal */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        bgImgSrc={imgBgSrc}
        codeImgSrc={imgCodeSrc}
        onSaveImage={handleSaveImage}
      />

      <poster
        ref={posterRef}
        width={canvasWidth}
        height={canvasHeight}
        backgroundUrl={imgBgSrc}
        qrCodeUrl={imgCodeSrc}
        downloadTrigger={downloadTrigger}
        drawType={'draw'}
        onSuccess={handlePosterSuccess}
      />
    </View>
  )
}

export default GlobalWrapper(MinePage)
