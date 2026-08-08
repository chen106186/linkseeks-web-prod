import React, { useState, useRef, useEffect, useCallback } from 'react'
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import cx from 'classnames'
import { Spin, message } from 'antd'
import SearchNoResult from '@/components/SearchNoResult'
import HelmetProvider from '@/context/helmetProvider'
import { getWebIntl } from '@/utils/locales'
import { decodeURLBase64 } from '@linkseeks/crypto'
import {
  GetProductShopPurchaseGetPurchaseListResponse,
  postMarketingMobileActivityGoodsRelationGoodsList,
  postProductMobileShopPurchaseSavePurchaseBatch,
} from '@apps/apis'
import { MARKETING_ACTIVITY_TYPE } from '@/constants/marketing'
import useCommodityDetail from './hooks/useCommodityDetail'
import usePageQuery from '@/hooks/usePageQuery'
import { ExchangeCommodityItemType } from '@/types/marketing'
import { LAYOUT_TYPE, MallInfoType } from '@/types/global'
import ImageBox from '@apps/components/src/web/ImageBox'
import ProductList from '@/components/ProductList'
import { CouponCommodityItemType } from '@/components/ProductList/types'
import { useLocation } from 'react-router-dom'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface CommodityPropsType {
  location: any
  layoutType: LAYOUT_TYPE
  mallInfo: MallInfoType
  memberId: number
  mallId: number
  shopId: number
  match?: any
  priceType?: number
}

interface ExchangeCommodityType {
  /**
   * 换购商品数据Id
   */
  promotionId?: number
  /**
   * 营销活动Id
   */
  activityId?: number
  /**
   * 营销活动类型
   */
  activityType?: number
  /**
   * 换购分组编号
   */
  groupNo?: number
  /**
   * 换购商品的Id
   */
  commodityId?: number
  /**
   * 换购商品的SkuId
   */
  skuId?: number
  /**
   * 配送方式
   */
  deliveryType?: number
  /**
   * 商品图片
   */
  logo?: string
  mainPic?: string
  /**
   * 名称
   */
  name?: string
  productName?: string
  /**
   * 单价
   */
  price?: number
  /**
   * 品牌
   */
  brand?: string
  /**
   * 品类
   */
  category?: string
  /**
   * 单位
   */
  unit?: string
  /**
   * 换购商品的单价
   */
  exchangePrice?: number
  /**
   * 换购的数量
   */
  exchangeQuantity?: number
  /**
   * 主商品购买数量
   */
  parentQuantity?: number
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员角色id
   */
  memberRoleId: number
  /**
   * 商品活动标签 ,String
   */
  tagList?: string[]
  /**
   * 主商品skuId
   */
  parentSkuId?: number
  /**
   * 店铺id
   */
  storeId?: number
}

/**
 * 活动商品列表页（赠品，换购商品）
 * @param props
 * @returns
 */
const ActivityCommodity: React.FC = () => {
  const translate = getWebIntl()
  const { search } = useLocation()
  const { userInfo, mallInfo, currentCity, layoutType } = useGlobalConext()
  const { purchaseList, updatePurchaseList } = usePurchaseOrderContext()
  const [loading, setLoading] = useState<boolean>(true)
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(COMMODITY_SHOW_TYPE.gird) // 展示方式：1：矩阵排列； 2:列表排列
  const [commodityList, setCommodityList] = useState<ExchangeCommodityType[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const clickFlag = useRef<boolean>(true)
  const { spuId, skuId, activityId, belongType, quantity, type, existIds } = usePageQuery(search)
  const [selectedSkuIds, setSelectedSkuIds] = useState<number[]>([])
  const purchaseListRef = useRef<GetProductShopPurchaseGetPurchaseListResponse>(purchaseList || [])
  const { linkPrefix } = useLink()
  const { commodityDetail, skuInfo } = useCommodityDetail({
    spuId,
    skuId,
    mallId: mallInfo?.id!,
  })

  useEffect(() => {
    if (existIds) {
      const decodeExistIds = decodeURLBase64(existIds)
      const ids = decodeExistIds.split(',')
      setSelectedSkuIds(ids.map((item: string) => Number(item)))
    }
  }, [existIds])

  const getExchangeCommodityList = () => {
    postMarketingMobileActivityGoodsRelationGoodsList(
      {
        shopId: mallInfo?.id!,
        activityId: +activityId,
        belongType: +belongType,
        skuId: +skuId,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      },
      { ctlType: 'none' },
    )
      .then((res) => {
        const { commodityList = [] } = res.data
        setCommodityList(commodityList)
        setTotalCount(commodityList.length)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (commodityDetail && skuInfo) {
      getExchangeCommodityList()
    }
  }, [commodityDetail, skuInfo])

  const checkoutUserInfo = (itemInfo: ExchangeCommodityType) => {
    if (userInfo) {
      if (userInfo?.memberRoleType !== 2) {
        message.info(translate('web.resource.mall.currentRole'))
        return false
      }
      if (userInfo?.memberId === commodityDetail?.memberId) {
        message.info(translate('web.resource.mall.bunenggoumaizijideshangpin'))
        return false
      }
      return true
    } else {
      message.info(translate('web.resource.mall.qingxiandenglu'))
      return false
    }
  }

  const handleAddPurchase = (itemInfo: ExchangeCommodityType) => {
    if (!checkoutUserInfo(itemInfo)) {
      return
    }

    // 判断购物车中该商品数量是否超过换购数量
    if (purchaseListRef.current && purchaseListRef.current.length > 0) {
      const itemCartInfo = purchaseListRef.current.find(
        (item) => item.purchaseSkuResp.id === itemInfo.skuId && item.parentSkuId === Number(skuId),
      )
      const mainCartInfo = purchaseListRef.current.find((item) => item.purchaseSkuResp.id === Number(skuId))

      if (mainCartInfo) {
        const ladders: any = mainCartInfo.goodsCartResp.topActivityDetail?.ladders || []
        let exchangeQuantity = 1
        for (const item of ladders) {
          for (const childItem of item.list) {
            if (childItem.skuId === Number(itemInfo.skuId)) {
              exchangeQuantity = childItem.num
              break
            }
          }
        }

        if (itemCartInfo && itemCartInfo.count >= Number(exchangeQuantity)) {
          message.destroy()
          message.info(translate('web.resource.mall.bunengchaoguohuangoushuliang'))
          return
        }
      }
    }

    if (clickFlag.current) {
      clickFlag.current = false

      const headers: any = {
        shopId: mallInfo?.id!,
      }

      const purchaseBatchList = [
        {
          commoditySkuId: itemInfo.skuId,
          setMealId: skuInfo?.skuId,
          purchaseCommodityType: 4, // 换购商品
          count: 1,
          isMain: false, // true 为主商品
          parentSkuId: skuInfo?.skuId,
        },
      ]

      // 判断购物车中是否已有主商品
      if (purchaseListRef.current && skuInfo) {
        const itemCartInfo = purchaseListRef.current.find((item) => item.purchaseSkuResp.id === skuInfo.skuId)
        if (!itemCartInfo) {
          purchaseBatchList.unshift({
            commoditySkuId: skuInfo.skuId!,
            setMealId: skuInfo.skuId,
            purchaseCommodityType: 4, // 换购商品
            count: quantity || 1, // 默认一件
            isMain: true, // true 为主商品
            parentSkuId: undefined,
          })
        }
      }

      postProductMobileShopPurchaseSavePurchaseBatch({ purchaseBatchList }, { headers })
        .then((res: any) => {
          clickFlag.current = true
          if (res.code === 1000) {
            message.destroy()
            message.success(translate('web.resource.mall.huopinyitianjiadaojinhuodan'))
            updatePurchaseList(mallInfo?.id)
            setSelectedSkuIds([...selectedSkuIds, Number(itemInfo.skuId)])
          }
        })
        .catch(() => {
          clickFlag.current = true
        })
    }
  }

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      purchaseListRef.current = purchaseList
    }
  }, [purchaseList])

  return (
    <HelmetProvider title={`${translate('web.resource.mall.huodonghuangou')}-${mallInfo?.name}`}>
      <div className={styles.commodity}>
        <div className={styles.mall_container}>
          {commodityDetail && skuInfo && (
            <div className={styles['commodity-detail-wrap']}>
              <div className={styles['commodity-detail-panel']}>
                <div className={styles['commodity-detail']}>
                  <div className={styles['commodity-detail-img']}>
                    <ImageBox src={skuInfo.logo} width={100} height={100} round={8} />
                    <div className={styles['commodity-detail-img-tag']}>
                      {translate('web.resource.mall.zhuyaoshangpin')}
                    </div>
                  </div>
                  <div className={styles['commodity-detail-main']}>
                    <div className={styles['commodity-detail-name']}>
                      <a
                        href={
                          layoutType === LAYOUT_TYPE.own
                            ? linkPrefix(`/commodity/detail/${commodityDetail.id}?skuId=${skuId}`)
                            : linkPrefix(
                                `/shop/${commodityDetail.storeId}/commodity/detail/${commodityDetail.id}?skuId=${skuId}`,
                              )
                        }
                      >
                        {commodityDetail.name}
                      </a>
                    </div>
                    <div className={styles['commodity-detail-slogan']}>{commodityDetail.slogan}</div>
                    {commodityDetail.sellingPoint && commodityDetail.sellingPoint.length > 0 && (
                      <div className={styles['commodity-detail-sellingPoint']}>
                        {commodityDetail.sellingPoint.map((item) => (
                          <div key={item} className={styles['commodity-detail-sellingPoint-item']}>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={styles['commodity-detail-spec']}>
                      {skuInfo.specList &&
                        skuInfo.specList.length > 0 &&
                        skuInfo.specList.map((item) => (
                          <span key={item.label}>
                            {item.label}: {item.value}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
                {Number(type) === MARKETING_ACTIVITY_TYPE.EXCHANGE && (
                  <div className={styles['exchange-tip']}>
                    ({translate('web.resource.mall.goumaibenshangpinkeyihuangouyixiarenyiyikuanshangpin')})
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.commodity_container}>
            <div className={styles.commodity_main}>
              <div className={styles.tool_bar_wrap}>
                <div className={styles.tool_bar}>
                  <div className={styles.tool_bar_left} />
                  <div className={styles.tool_bar_right}>
                    <div className={styles.count}>
                      <span>
                        {translate('web.resource.mall.gongjigeshangpin', {
                          defaultMessage: '共{{count}}个商品',
                          count: totalCount,
                        })}
                      </span>
                    </div>
                    <div className={styles.showTypeBox}>
                      <AppstoreOutlined
                        translate={undefined}
                        className={cx(styles.icon, showType === COMMODITY_SHOW_TYPE.gird ? styles.active : '')}
                        onClick={() => setShowType(COMMODITY_SHOW_TYPE.gird)}
                      />
                    </div>
                    <div className={styles.showTypeBox}>
                      <UnorderedListOutlined
                        translate={undefined}
                        className={cx(styles.icon, showType === COMMODITY_SHOW_TYPE.list ? styles.active : '')}
                        onClick={() => setShowType(COMMODITY_SHOW_TYPE.list)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {(commodityList.length === 0 || !commodityList) && !loading ? (
                <SearchNoResult search="" />
              ) : (
                <>
                  <Spin spinning={loading}>
                    <ProductList
                      dataSource={commodityList as CouponCommodityItemType[]}
                      layoutType={LAYOUT_TYPE.activity}
                      type={showType}
                      onItemClick={(info: ExchangeCommodityType) => handleAddPurchase(info)}
                      isMro={false}
                      path="/commodity/detail"
                      disabledSkuIds={selectedSkuIds}
                    />
                  </Spin>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default ActivityCommodity
