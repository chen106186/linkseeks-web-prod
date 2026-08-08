import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { PlusOutlined, PauseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'

import styles from './index.less'
import { postMarketingWebActivityGoodsSetmealList } from '@apps/apis'
import { postProductCustomerPurchaseSavePurchaseBatch } from '@apps/apis'
import { Button, message } from 'antd'
import { ImageBox } from '@apps/components'
import type { ProductInfoType, PromotionItem } from '../../types'

interface CombinationProps {
  /** 商品详情信息 */
  productInfo: ProductInfoType
  /** 商城信息 */
  mallInfo: {
    id: number
    customerMemberId: number
    customerMemberRoleId: number
  }
  /**
   * 组合套餐活动信息
   */
  activityInfo: PromotionItem | undefined
  /** skuId */
  skuId: number | undefined
  fnSuccess: (num: any) => void
  commodityDetail: any
}
type postMarketingWebActivityGoodsSetmealListResponse = {
  /**
   * 件数
   */
  totalNum: number
  /**
   * 套餐价
   */
  totalAmount: number
  /**
   * 已省金额
   */
  discountAmount: number
  /**
   * 左侧距离
   */
  left: number
  /**
   * 分组编号优惠阶梯
   */
  groupNo: number
  /**
   * 商品列表 ,SetmealGoodsResp
   */
  goodsList: {
    /**
     * 商品id
     */
    productId?: number
    /**
     * skuId
     */
    skuId?: number
    /**
     * 商品名称
     */
    productName?: string
    /**
     * 规格
     */
    type?: string
    /**
     * 品类
     */
    category?: string
    /**
     * 品牌
     */
    brand?: string
    /**
     * 单位
     */
    unit?: string
    /**
     * 商品价格
     */
    price?: number
    /**
     * 分组编号优惠阶梯
     */
    groupNo?: number
    /**
     * 套餐价格
     */
    groupPrice?: number
    /**
     * 赠品主图
     */
    productImgUrl?: string
    /**
     * 赠送数量搭配数量
     */
    num?: number
    /**
     * sku到手价搭配数量
     */
    totalAmount?: number
    /**
     * sku节省金额
     */
    discountAmount?: number
  }[]
}

const Combination: React.FC<CombinationProps> = (props) => {
  const { activityInfo, mallInfo, skuId, productInfo, fnSuccess } = props
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [mockInfo, setmockInfo] = useState<any>([])
  const [commodityPrice, setCommodityPrice] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [shouldResetPrice, setShouldResetPrice] = useState(0)
  const PRICE_SYMBOL = '¥'
  const fetchActivityInfo = () => {
    const param: any = {
      shopId: mallInfo.id,
      belongType: activityInfo?.belongType,
      activityId: activityInfo?.activityId,
      skuId,
    }
    postMarketingWebActivityGoodsSetmealList(param).then((res) => {
      message.destroy()
      if (res.code === 1000) {
        const mockInfoDesc = res.data.map((item: any) => {
          item.left = 0
          return item
        })
        setmockInfo(mockInfoDesc)
        setShouldResetPrice(shouldResetPrice + 1)
        setCurrentTab(res.data[0].groupNo)
      }
    })
  }

  const handleChangeCurrentTab = (groupNo: number) => {
    setCurrentTab(groupNo)
  }

  const fnGetMaxDiscountAmount = () => {
    const obj = {
      discountAmount: 0,
      price: 0,
    }
    mockInfo.forEach((item: any) => {
      if (item.discountAmount > obj.discountAmount) {
        obj.discountAmount = item.discountAmount
      }
      item.goodsList.map((second: any) => {
        if (second.productId === productInfo.id) {
          // 当前商品就不显示了
          obj.price = second.price
        }
      })
    })
    setCommodityPrice(obj)
  }
  const fnJoinPurchase = (packageObj: any) => {
    let parentObj: any = {}
    packageObj.goodsList.some((item: { productId: number }) => {
      if (item.productId === productInfo.id) {
        parentObj = item
      }
    })
    const purchaseBatchList = packageObj.goodsList.map((item: any) => {
      let isMain = false
      if (item.productId === productInfo.id) {
        isMain = true
      }
      return {
        commoditySkuId: item.skuId,
        count: item.num,
        id: item.productId,
        isMain: isMain,
        parentSkuId: isMain ? '' : parentObj.skuId,
        purchaseCommodityType: 2,
        setMealId: item.groupNo,
        setMealName: '',
        customerMemberId: mallInfo.customerMemberId,
        customerMemberRoleId: mallInfo.customerMemberRoleId,
      }
    })
    const headers: any = {
      shopId: mallInfo.id,
    }
    setIsLoading(true)
    // postProductMobileShopPurchaseSavePurchaseBatch

    postProductCustomerPurchaseSavePurchaseBatch({ purchaseBatchList }, { headers }).then((res) => {
      message.destroy()
      if (res.code === 1000) {
        setIsLoading(false)
        fnSuccess(res.data)
      }
    })
  }

  const handlePrev = (item: postMarketingWebActivityGoodsSetmealListResponse) => {
    if (item.left < 0) {
      item.left = item.left + 136
      console.log(mockInfo)
      setmockInfo([...mockInfo])
    }
  }

  const handleNext = (item: postMarketingWebActivityGoodsSetmealListResponse) => {
    const maxLeft = (item.goodsList.length - 6) * 136
    console.log(maxLeft)
    console.log(item.left)
    if (Math.abs(item.left) < maxLeft) {
      item.left = item.left - 136
      setmockInfo([...mockInfo])
    }
  }

  useEffect(() => {
    if (activityInfo && skuId) {
      fetchActivityInfo()
    }
  }, [activityInfo, skuId])

  useEffect(() => {
    fnGetMaxDiscountAmount()
  }, [shouldResetPrice])

  return (
    <div className={styles.combination}>
      <div className={styles.combination_title}>
        <span>组合套餐</span>
        <div className={styles.combination_sub_title}>
          共{mockInfo.length}组套餐，最多可省￥{commodityPrice.discountAmount}
        </div>
      </div>
      <div className={styles.combination_container}>
        <div className={styles.combination_tabs}>
          {mockInfo.map((item: postMarketingWebActivityGoodsSetmealListResponse) => (
            <div
              className={cx(styles.combination_tabs_item, item.groupNo === currentTab ? styles.active : {})}
              onClick={() => handleChangeCurrentTab(item.groupNo)}
              key={`groupNav${item.groupNo}`}
            >
              套餐{item.groupNo}
            </div>
          ))}
        </div>
        <div className={styles.combination_tabs_item_container}>
          {mockInfo.map(
            (item: postMarketingWebActivityGoodsSetmealListResponse, index: number) =>
              item.groupNo === currentTab && (
                <div
                  className={styles.combination_tabs_item_wrap}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`combination_tabs_item_wrap_${item.groupNo}${index}`}
                >
                  <div className={styles.combination_tabs_item_mainGoods}>
                    <ImageBox width={120} height={120} src={productInfo?.mainPic} />
                    <div className={styles.combination_goods_name}>{productInfo?.name}</div>
                    <div className={styles.combination_goods_price}>
                      <span>{PRICE_SYMBOL}</span>
                      {item.goodsList[0].price}
                    </div>
                  </div>
                  <PlusOutlined className={styles.combination_tabs_item_plusIcon} translate={undefined} />
                  <div className={styles.combination_tabs_item_mealGoods_wrap}>
                    {item.goodsList && item.goodsList.length > 6 && (
                      <div
                        className={styles.combination_arrow_btn}
                        onClick={() => {
                          handlePrev(item)
                        }}
                      >
                        <LeftOutlined translate={undefined} />
                      </div>
                    )}

                    <div className={styles.combination_tabs_item_mealGoods_list}>
                      <div className={styles.combination_tabs_item_mealGoods_list_body} style={{ left: item.left }}>
                        {item.goodsList &&
                          item.goodsList.map((mealItem: any, second: number) => {
                            if (mealItem.productId === productInfo.id) {
                              // 当前商品就不显示了
                              return null
                            }
                            return (
                              <div
                                className={styles.combination_tabs_item_mealGoods_list_item}
                                // eslint-disable-next-line react/no-array-index-key
                                key={`combination_tabs_item_mealGoods_list_item_${mealItem.productId}${second}`}
                              >
                                <ImageBox width={120} height={120} imgUrl={mealItem.productImgUrl} />
                                <div className={styles.combination_goods_name}>{mealItem.productName}</div>
                                <div className={styles.combination_goods_price}>
                                  <span>{PRICE_SYMBOL}</span>
                                  {mealItem.price}
                                </div>
                                <a
                                  className={styles.combination_tabs_item_mealGoods_list_jump}
                                  href={`/orderAbility/saleOrder/agentPurchaseOrder/commodityDetail?id=${mealItem.productId}`}
                                />
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    {item.goodsList && item.goodsList.length > 6 && (
                      <div
                        className={styles.combination_arrow_btn}
                        onClick={() => {
                          handleNext(item)
                        }}
                      >
                        <RightOutlined translate={undefined} />
                      </div>
                    )}
                  </div>
                  <PauseOutlined className={styles.combination_pauseIcon} rotate={90} translate={undefined} />
                  <div className={styles.combination_meal_price_wrap}>
                    <div className={styles.combination_meal_price_line}>共{item.goodsList.length}件商品</div>
                    <div className={styles.combination_meal_price_line}>
                      套餐价
                      <span className={styles.combination_meal_price_line_price}>
                        <span>{PRICE_SYMBOL}</span>
                        {item.totalAmount}
                      </span>
                    </div>
                    <div className={styles.combination_meal_price_line}>
                      可省 <span>{PRICE_SYMBOL}</span>
                      {item.discountAmount || 0}
                    </div>
                    {/* <div className={styles.combination_meal_price_btn} onClick={()=>{fnJoinPurchase(item)}}>加入购物车</div> */}
                    <Button
                      type="primary"
                      loading={isLoading}
                      onClick={() => {
                        fnJoinPurchase(item)
                      }}
                    >
                      加入购物车
                    </Button>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  )
}

export default Combination
