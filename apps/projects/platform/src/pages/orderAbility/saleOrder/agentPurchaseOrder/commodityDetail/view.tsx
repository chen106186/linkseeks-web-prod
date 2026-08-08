import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { Spin, Button, message } from 'antd'
import DialogModal from '../components/DialogModal'
import InputNumber from '../components/InputNumber'
import { FileTextOutlined } from '@ant-design/icons'
import { numFormat } from '../utils/numFormat'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
// import InterestedCommodity from '@/components/InterestedCommodity'
import Exhibition from './components/Exhibition'
// import ShopInfo from './components/ShopInfo'
import ProductDescription from './components/ProductDescription'
// import Interested from './components/Interested'
import CommodityPrice from './components/Price'
import Promotion from './components/Promotion'
import Coupons from './components/Coupons'
// import GroupBuy from './components/GroupBuy'
import Combination from './components/Combination'
import SkuInfo from './components/SkuInfo'
import Delivery from './components/Delivery'
import ErrorResult from './error'
import { isEmpty } from 'lodash'

import cx from 'classnames'
import type {
  GetProductShopStoreGetCommodityDetailResponse,
  PostProductShopStoreGetCommodityListResponseDetail,
} from '@apps/apis'
import { getProductShopStoreGetCustomerCommodityDetail } from '@apps/apis'
import { getMemberManageLowerCreditParamGet } from '@apps/apis'
import type { PostOrderCreatePaymentFindResponse } from '@apps/apis'
import { postOrderCreatePaymentFind } from '@apps/apis'
import type { PostMarketingWebActivityGoodsDetailTagRequest } from '@apps/apis'
import {
  postMarketingWebAgentActivityGoodsDetailTag,
  postMarketingWebAgentActivityGoodsCheckQuantity,
} from '@apps/apis'
import { MarketingTypeEnum } from '../constants/marketing'
import type { MarketingDetailType, CurrentSkuItemType, GroupDetailType, PromotionItem } from './types'
import { OrderModeType, DEFAULT_CITY, CHANNEL_COMMODITY, MEMBER_COMMODITY } from '../constants'
import styles from './index.less'
import useAgentInfo from '../hooks/useAgentInfo'
import { PageHeaderWrapper } from '@apps/components'
import usePurchaseOrder from '../hooks/usePurchaseOrder'
import { COMMODITY_TYPE, LAYOUT_TYPE } from '@/constants'
import { getWebIntl } from '@apps/locales'
import IconFont from '../utils/iconfont'

interface ImgItemType {
  id: string
  commodityPic: string
}
const translate = getWebIntl()

export type CommodityDetailType = GetProductShopStoreGetCommodityDetailResponse

const CommodityDetail: React.FC = (props: any) => {
  const { id } = useQuery()
  const intl = useIntl()
  const [spinLoading, setSpinLoading] = useState<boolean>(true)
  const [errorInfo, setErrorInfo] = useState<any>()
  const [commodityDetail, setCommodityDetail] = useState<CommodityDetailType>()
  const [stockCount] = useState<number>(0)
  const [commodityImgList, setCommodityImgList] = useState<ImgItemType[]>([])
  const [payWayInfo, setPayWayInfo] = useState<PostOrderCreatePaymentFindResponse>()
  const [parameter, setParameter] = useState<number>() // 权益参数
  const [commonCategoryCommodityList] = useState<PostProductShopStoreGetCommodityListResponseDetail[]>([])
  const [, setPaymentError] = useState<string | undefined>()
  const [buyCount, setBuyCount] = useState<number>(1)
  const [addSuccessVisible, setAddSuccessVisible] = useState<boolean>(false)
  const [marketingData, setMarketingData] = useState<MarketingDetailType>()
  const [hasActivity, setHasActivity] = useState<boolean>(false)
  const [currentSku, setCurrentSku] = useState<CurrentSkuItemType>()
  const [isGroupBuy, setIsGroupBuy] = useState<boolean>(false)
  const [currentGroupDetail, setCurrentGroupDetail] = useState<GroupDetailType>()
  const [inAreaState, setInAreaState] = useState<boolean>(false)
  const { agentPurchaseOrderInfo } = useAgentInfo({ check: true })
  const mallId = agentPurchaseOrderInfo?.shopId
  const layoutType = agentPurchaseOrderInfo?.isSelf ? LAYOUT_TYPE.own : LAYOUT_TYPE.mall
  const type = 1
  const clickFlag = useRef<boolean>(true)
  const allImgList = useRef<ImgItemType[]>([])
  const { purchaseCount, saveOrUpdatePurchase, fetchPurchaseCount } = usePurchaseOrder({
    orderId: agentPurchaseOrderInfo?.orderId,
    mallId: agentPurchaseOrderInfo?.shopId,
    customerMemberId: agentPurchaseOrderInfo?.memberId,
    customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    customerMemberLevel: agentPurchaseOrderInfo?.memberLevel,
  })

  useEffect(() => {
    console.log(agentPurchaseOrderInfo, 'agentPurchaseOrderInfo')
    if (agentPurchaseOrderInfo) {
      fetchDetail()
    }
  }, [agentPurchaseOrderInfo])

  const getOrderMode = () => {
    return OrderModeType.BUYER
  }

  /**
   * 去除重复的图片
   * @param list
   * @param addList
   */
  const deleteRepeatImg = (list: any[], addList: any) => {
    const result = [...list]
    for (const addItem of addList) {
      if (list.every((item) => item.commodityPic !== addItem.commodityPic)) {
        result.push(addItem)
      }
    }
    return result
  }

  /**
   * 对支付方式进行排序
   * @param info 支付信息
   * @returns  支付信息
   */
  const sortPayWayInfo = (info: PostOrderCreatePaymentFindResponse) => {
    if (info && info?.payTypes && info?.payTypes.length > 0) {
      const newPayWayInfo: PostOrderCreatePaymentFindResponse = { ...info }
      const newPayTypes = info.payTypes.sort((a, b) => (b.payType === 6 || b.payType === 1 ? 1 : -1))
      newPayWayInfo.payTypes = newPayTypes
      return newPayWayInfo
    }
    return info
  }

  /**
   * 校验活动商品数量是否符合活动限购数量
   * @param operateType 操作类型1：加入购物车2：立即购买3：购物车调整数量
   * @returns
   */
  const checkActivityProductQuantity = async (operateType: number): Promise<boolean> => {
    try {
      const param: any = {
        operateType,
        shopId: mallId,
        productId: id,
        skuId: currentSku?.skuId,
        commodityType: 1,
        quantity: buyCount,
        upperMemberId: commodityDetail?.memberId,
        upperRoleId: commodityDetail?.memberRoleId,
      }
      const headers: any = {
        agentMemberId: agentPurchaseOrderInfo?.memberId,
        agentRoleId: agentPurchaseOrderInfo?.roleId,
      }
      const res = await postMarketingWebAgentActivityGoodsCheckQuantity(param, { headers })
      message.destroy()
      if (res.code === 1000 && res.data) {
        return true
      } else {
        message.info(res.message)
        return false
      }
    } catch (error) {
      return false
    }
  }

  /**
   * 获取供货商的支付方式
   * @param memberId
   */
  const getPayWayListByMemberId = (memberId: number, memberRoleId: number, skuId?: number) => {
    const param: any = {
      shopId: mallId,
      vendors: [
        {
          vendorMemberId: memberId,
          vendorRoleId: memberRoleId,
          products: [
            {
              productId: id,
              skuId: skuId ? skuId : currentSku?.skuId,
              freightType: commodityDetail?.logistics.carriageType || null,
              crossBorder: commodityDetail?.isCrossBorder,
            },
          ],
        },
      ],
      orderMode: getOrderMode(),
      buyerMemberId: agentPurchaseOrderInfo.memberId,
      buyerRoleId: agentPurchaseOrderInfo.roleId,
      buyerMemberName: agentPurchaseOrderInfo.memberName,
    }
    postOrderCreatePaymentFind(param)
      .then((res) => {
        message.destroy()
        if (res.code === 1000) {
          setPayWayInfo(sortPayWayInfo(res.data))
          setPaymentError(undefined)
        } else {
          // setPaymentError(res.message)
          // setPaymentError(intl.formatMessage({id: `${res.code}`, defaultMessage: res.message}))
        }
      })
      .catch(() => {
        message.destroy()
      })
  }

  /**
   * 初始化商品详情数据
   * @param skuList
   */
  const initAttributeAndValueList = (dataInfo: any) => {
    const skuList = dataInfo?.commoditySkuList
    if (!skuList) {
      return
    }
    let tempImgList: any = [
      {
        id: dataInfo.id,
        commodityPic: dataInfo.mainPic,
      },
    ]
    for (const item of skuList) {
      // 初始化商品图片-》 商品主图加上商品属性图片
      if (item.commodityPic) {
        const tempCommodityPic = item.commodityPic.map((picItem: any, picIndex: any) => {
          return {
            id: `${item.id}-${picIndex}`,
            commodityPic: picItem,
          }
        })
        tempImgList = deleteRepeatImg(tempImgList, tempCommodityPic)
      }
    }

    setCommodityImgList(tempImgList)
    allImgList.current = tempImgList
  }

  /**
   * 根据当前用户（上级会员），查询下级会员的价格权益参数设置
   * @param memberId
   * @param memberRoleId
   */
  const getMemberCredit = (memberId: number, memberRoleId: number) => {
    const param: any = {
      subMemberId: memberId,
      subRoleId: memberRoleId,
    }
    getMemberManageLowerCreditParamGet(param).then((res) => {
      if (res.code === 1000) {
        setParameter(res.data?.parameter)
      }
    })
  }

  // 获取商品活动相关
  const getMarketingCampaign = async (params: PostMarketingWebActivityGoodsDetailTagRequest) => {
    const headers: any = {
      agentMemberId: agentPurchaseOrderInfo?.memberId,
      agentRoleId: agentPurchaseOrderInfo?.roleId,
    }
    const { data, code } = await postMarketingWebAgentActivityGoodsDetailTag(params, { headers })
    message.destroy()
    if (code === 1000 && data) {
      setMarketingData(data as unknown as MarketingDetailType)
      // 如果有活动标签，则表示是活动商品
      if (data.tagDetailList && data.tagDetailList.length > 0) {
        // 排除拼团商品
        if (
          data.tagDetailList.every(
            (item: { activityType: number }) => item.activityType !== MarketingTypeEnum.activity_type_9,
          )
        ) {
          setHasActivity(true)
        }
      } else {
        setCurrentGroupDetail(undefined)
        setHasActivity(false)
        setIsGroupBuy(false)
      }
      return data
    }
  }

  /**
   * 获取商品详情
   */
  const fetchDetail = () => {
    const params: any = {
      commodityId: id,
      customerMemberId: agentPurchaseOrderInfo?.memberId,
      customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    }
    const headers: any = {
      type,
      shopId: mallId,
    }

    getProductShopStoreGetCustomerCommodityDetail(params, { headers }).then(async (res) => {
      if (res.code === 1000) {
        const data = res.data
        setErrorInfo(null)
        setCommodityDetail(data)
        initAttributeAndValueList(data)

        if (res.data?.priceType === 1 && res.data?.isMemberPrice) {
          getMemberCredit(agentPurchaseOrderInfo?.memberId, agentPurchaseOrderInfo?.roleId)
        }
      } else {
        setErrorInfo(res.message)
      }
      setSpinLoading(false)
    })
  }

  const getLadderPrice = (): number => {
    let ladderPrice = 0
    if (!currentSku?.ladder) {
      return 0
    }
    if (currentSku.ladder.length <= 1) {
      ladderPrice = currentSku.ladder[0]?.price
    } else {
      const temp = currentSku.ladder.filter((item) => {
        return Number(buyCount) >= Number(item.min) && Number(buyCount) <= Number(item.max)
      })
      if (isEmpty(temp)) {
        // const maxItem =  getMaxCountRange(currentSku.ladder, buyCount)
        // ladderPrice = maxItem.price
      } else {
        ladderPrice = temp[0]?.price
      }
    }
    return ladderPrice
  }

  /**
   * 判断是否指定的营销活动商品
   */
  const judgeIsGroupBuy = (tagList: PromotionItem[] | undefined, activityType: MarketingTypeEnum): boolean => {
    if (!tagList) return false
    return tagList.some((item) => item.activityType === activityType)
  }

  /**
   * 根据购买的数量获取单前商品单价
   * @param useParameter 是否使用会员价
   * @param useActivityPrice 是否使用活动价
   * @returns
   */
  const getUnitPrice = (useParameter = true, useActivityPrice = true) => {
    let unitPrice = 0
    if (!currentSku?.ladder) {
      return 0
    }

    if (useActivityPrice && marketingData && hasActivity) {
      if (judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_9)) {
        // 拼团活动价格处理
        unitPrice = marketingData.preferentialPrice
      } else if (judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_12)) {
        // 秒杀活动价格处理
        unitPrice = marketingData.preferentialPrice
      } else if (marketingData.promotionPrice) {
        // 其他活动价格处理
        unitPrice = marketingData.promotionPrice
      } else {
        unitPrice = getLadderPrice()
      }
    } else {
      unitPrice = getLadderPrice()
    }

    // 会员折扣价格(如果含有活动，则不需要在乘会员折扣，后台已计算进去)
    if (parameter && useParameter && !isGroupBuy && !hasActivity) {
      unitPrice = unitPrice * parameter
    }
    return unitPrice
  }

  const fnHandleAddToPurchaseSuccesss = () => {
    fetchPurchaseCount()
    setAddSuccessVisible(true)
  }

  const getCombinationActivity = useMemo(() => {
    if (!marketingData) return undefined
    if (!marketingData.tagDetailList) return undefined
    const mealDetail = marketingData.tagDetailList.filter(
      (item) => item.activityType === MarketingTypeEnum.activity_type_15,
    )[0]
    if (mealDetail) {
      return mealDetail
    }
    return undefined
  }, [marketingData])

  /**
   * 加入购物车
   */
  const handleAddToPurchase = async () => {
    if (!currentSku) {
      message.destroy()
      message.info(intl.formatMessage({ id: 'commodityDetail.index.attribute' }))
      return
    }

    if (hasActivity) {
      if (!(await checkActivityProductQuantity(1))) {
        return
      }
    }

    const minOrder = commodityDetail?.minOrder ? commodityDetail.minOrder : 1

    if (buyCount < minOrder) {
      message.destroy()
      message.info(intl.formatMessage({ id: 'commodityDetail.index.quantity' }))
      return
    }

    if (clickFlag.current) {
      clickFlag.current = false
      const res = await saveOrUpdatePurchase({
        skuId: currentSku.skuId,
        count: buyCount,
        showMsg: false,
      })
      if (res) {
        clickFlag.current = true
        setAddSuccessVisible(true)
      } else {
        clickFlag.current = true
      }
    }
  }

  /**
   * 根据条件渲染页面按钮
   */
  const renderBtn = () => {
    if (commodityDetail?.isPublish) {
      switch (commodityDetail?.priceType) {
        case COMMODITY_TYPE.prompt:
          if (currentSku && currentSku.stockNum > 0) {
            return (
              <>
                <Button
                  type="primary"
                  disabled={!inAreaState}
                  className={cx(styles.product_info_btn_item)}
                  onClick={() => handleAddToPurchase()}
                >
                  <IconFont type="icon-xiadan" />
                  <span>{intl.formatMessage({ id: 'commodityDetail.index.AddPurchaseOrder' })}</span>
                </Button>
                <Button
                  className={cx(styles.product_info_btn_item, styles.add)}
                  onClick={() => history.push('/orderAbility/saleOrder/agentPurchaseOrder/commodity')}
                >
                  <span>{intl.formatMessage({ id: 'commodityDetail.index.selectCommodity' })}</span>
                </Button>
              </>
            )
          } else {
            return (
              <Button className={cx(styles.product_info_btn_item, styles.buy)}>
                {translate('web.resource.order.zanwukucun')}
              </Button>
            )
          }
      }
    } else {
      return (
        <Button disabled className={cx(styles.product_info_btn_item, styles.buy)}>
          {translate('web.common.yixiajia')}
        </Button>
      )
    }
  }

  const renderPayWay = () => {
    if (payWayInfo && payWayInfo.required) {
      if (payWayInfo.payTypes && payWayInfo.payTypes.length > 0) {
        return payWayInfo.payTypes.map((item) => item.payTypeName).join(' ')
      }
    } else if (payWayInfo && !payWayInfo.required) {
      return intl.formatMessage({ id: 'commodityDetail.index.NoPaymentRequired' })
    }
    return '-'
  }

  useEffect(() => {
    if (currentSku && commodityDetail) {
      getPayWayListByMemberId(commodityDetail.memberId, commodityDetail.memberRoleId)
      getMarketingCampaign({
        shopId: mallId,
        categoryId: commodityDetail.customerCategoryId!,
        brandId: commodityDetail.brandId,
        productId: commodityDetail.id!,
        memberId: commodityDetail?.memberId,
        roleId: commodityDetail?.memberRoleId,
        skuId: currentSku.skuId,
        filterGroup: false,
      })
    }
  }, [currentSku])

  return (
    <PageHeaderWrapper
      extra={
        <div
          className={cx(styles.shopping_cart)}
          onClick={() => history.push('/orderAbility/saleOrder/agentPurchaseOrder/purchaseOrder')}
        >
          <FileTextOutlined className={styles.card_icon} translate={undefined} />
          <span>{intl.formatMessage({ id: 'index.Header.PurchaseOrder' })}</span>
          <div className={styles.badge}>{purchaseCount}</div>
        </div>
      }
    >
      <Spin spinning={spinLoading}>
        <div className={styles.commodity_detail}>
          {!errorInfo ? (
            commodityDetail && (
              <div className={styles.commodity_detail_container}>
                <div className={styles.commodity_detail_info_wrap}>
                  <div className={styles.commodity_detail_info}>
                    <Exhibition imgList={commodityImgList} />
                    <div className={styles.product_info_container}>
                      <div className={styles.product_info}>
                        <div className={styles.product_info_name}>
                          <span>{commodityDetail?.name}</span>
                        </div>
                        <div className={styles.product_info_tags}>
                          <div className={styles.product_info_tags_item}>{commodityDetail?.slogan}</div>
                        </div>
                        <div className={styles.product_info_sellpoints}>
                          {commodityDetail?.sellingPoint &&
                            commodityDetail?.sellingPoint.length > 0 &&
                            commodityDetail?.sellingPoint.map((item: any, index: number) => (
                              <div
                                className={styles.product_info_sellpoints_item}
                                key={`product_info_tags_item_${item.id}`}
                              >
                                {item}
                                {index !== commodityDetail?.sellingPoint.length - 1 ? ' ' : ''}
                              </div>
                            ))}
                        </div>
                        {/* 现货商品价格 */}
                        {commodityDetail?.priceType === COMMODITY_TYPE.prompt && (
                          <CommodityPrice
                            skuId={currentSku?.skuId}
                            productInfo={commodityDetail}
                            marketingData={marketingData}
                            commodityPriceInfo={currentSku?.ladder || []}
                            mallId={mallId}
                            hasActivity={hasActivity}
                            currentSku={currentSku}
                            parameter={parameter}
                            buyCount={buyCount}
                            groupDetail={currentGroupDetail}
                            activityPrice={getUnitPrice()}
                            type={type}
                          />
                        )}
                        {/* 促销 */}
                        <Promotion data={marketingData?.tagDetailList} skuId={currentSku?.skuId} />
                        {/* 优惠券 */}
                        {marketingData?.canUseCoupon === 1 && (
                          <Coupons
                            data={marketingData?.couponList}
                            mallId={mallId}
                            agentMemberId={agentPurchaseOrderInfo?.memberId}
                            agentRoleId={agentPurchaseOrderInfo?.roleId}
                          />
                        )}
                        {/* 配送 */}
                        <Delivery
                          productInfo={commodityDetail}
                          userInfo={{
                            memberId: agentPurchaseOrderInfo?.memberId,
                            roleId: agentPurchaseOrderInfo?.roleId,
                          }}
                          limitWay={commodityDetail?.salesAreaTemplate?.limitWay}
                          currentCity={DEFAULT_CITY}
                          onAreaState={(state) => setInAreaState(state)}
                        />
                        {commodityDetail?.sendCycle ? (
                          <div className={styles.product_info_line}>
                            <div className={styles.product_info_line_label}>
                              {intl.formatMessage({
                                id: 'commodityDetail.label.sendCycle',
                                defaultMessage: '发货周期',
                              })}
                            </div>
                            <div className={styles.product_info_line_brief}>
                              <span className={styles.text}>
                                {intl.formatMessage({
                                  id: 'commodityDetail.brief.sendCycle',
                                  defaultMessage: '下单后{sendCycle}天发货',
                                  sendCycle: commodityDetail?.sendCycle || 0,
                                })}
                              </span>
                            </div>
                          </div>
                        ) : null}
                        {/* sku信息 */}
                        <SkuInfo
                          // skuList={skuList}
                          // skuId={skuId}
                          type={type}
                          productInfo={commodityDetail}
                          onSelect={(info) => setCurrentSku(info)}
                          currentSku={currentSku}
                        />

                        <div className={styles.product_info_line}>
                          <div className={styles.product_info_line_label}>
                            {intl.formatMessage({ id: 'commodityDetail.index.buyNumber' })}
                          </div>
                          <div className={cx(styles.product_info_line_brief, styles.row)}>
                            <InputNumber
                              disabled={currentSku?.stockNum === 0}
                              value={buyCount}
                              min={commodityDetail?.minOrder || 1}
                              max={currentSku?.stockNum || stockCount}
                              onChange={(value: number) => setBuyCount(value)}
                            />
                            <span className={cx(styles.text, styles.mar_left_10)}>{commodityDetail?.unitName}</span>
                            <span className={cx(styles.text, styles.mar_left_10)}>
                              {`(${intl.formatMessage({ id: 'pay.pointsMall.stock' })}${numFormat(
                                currentSku?.stockNum || stockCount,
                              )}${commodityDetail?.unitName || ''})`}
                            </span>
                          </div>
                        </div>
                        {/* 积分商品信息显示 */}
                        {commodityDetail?.priceType !== COMMODITY_TYPE.integral && (
                          <div className={styles.product_info_line}>
                            <div className={styles.product_info_line_label}>
                              {intl.formatMessage({ id: 'commodityDetail.index.smallBuy' })}
                            </div>
                            <div className={styles.product_info_line_brief}>
                              <span className={styles.text}>
                                {commodityDetail?.minOrder} {commodityDetail?.unitName}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className={styles.product_info_btn_group}>{renderBtn()}</div>
                        <div className={styles.product_info_line}>
                          <div className={styles.product_info_line_label}>
                            {intl.formatMessage({ id: 'commodityDetail.index.PayType' })}
                          </div>
                          <div className={styles.product_info_line_brief}>
                            <span className={styles.text}>{renderPayWay()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_15) && (
                  <Combination
                    mallInfo={{
                      id: agentPurchaseOrderInfo?.shopId,
                      customerMemberId: agentPurchaseOrderInfo?.memberId,
                      customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
                    }}
                    commodityDetail={commodityDetail}
                    productInfo={commodityDetail}
                    activityInfo={getCombinationActivity}
                    skuId={currentSku?.skuId}
                    fnSuccess={fnHandleAddToPurchaseSuccesss}
                  />
                )}
                <div className={styles.commodity_detail_body}>
                  <div className={styles.commodity_detail_body_right}>
                    <ProductDescription
                      storeId={mallId}
                      memberId={commodityDetail?.memberId}
                      commodityDetail={commodityDetail}
                      dataList={commonCategoryCommodityList}
                      mallInfo={undefined}
                      layoutType={layoutType}
                    />
                  </div>
                </div>
              </div>
            )
          ) : (
            <ErrorResult errorMessage={errorInfo} />
          )}
          <DialogModal
            title={intl.formatMessage({ id: 'commodityDetail.index.addSuccess' })}
            visible={addSuccessVisible}
            onCancel={() => setAddSuccessVisible(false)}
          >
            <div className={styles.add_success}>
              <div className={styles.add_success_info}>
                <div className={styles.add_success_info_title}>
                  <i className={styles.add_success_info_icon} />
                  <span>{intl.formatMessage({ id: 'commodityDetail.index.addedPurchase' })}</span>
                </div>
                <div className={styles.add_success_info_text}>
                  <span>{intl.formatMessage({ id: 'commodityDetail.index.orderTotal' })}</span>
                  <b>{purchaseCount}</b>
                  <span>
                    {intl.formatMessage({ id: 'commodityDetail.index.individual' })}
                    {intl.formatMessage({ id: 'order.index.shop' })}
                  </span>
                </div>
              </div>
              <div
                className={cx(styles.add_success_btn, styles.primary)}
                onClick={() => history.push('/orderAbility/saleOrder/agentPurchaseOrder/purchaseOrder')}
              >
                {intl.formatMessage({ id: 'commodityDetail.index.settlement' })}
              </div>
              <div className={styles.add_success_btn} onClick={() => setAddSuccessVisible(false)}>
                {intl.formatMessage({ id: 'commodityDetail.index.ContinueShopping' })}
              </div>
            </div>
          </DialogModal>
        </div>
      </Spin>
    </PageHeaderWrapper>
  )
}

export default CommodityDetail
