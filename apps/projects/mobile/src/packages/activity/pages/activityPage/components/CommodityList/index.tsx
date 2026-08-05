import React, { useState } from 'react'
import { Text, View, CountDown } from '@apps/mobile-ui'
import { ColumnCommodity, Price, RowCommodity } from '@/components/Commodity'
import Progress from '@/components/Progress'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import {
  ACTIVITY_BARGAIN,
  ACTIVITY_BUYSWAP,
  ACTIVITY_COMBINATION,
  ACTIVITY_FULLSWAP,
  ACTIVITY_GIVECOUPON,
  ACTIVITY_GIVEPRODUCT,
  ACTIVITY_HOT,
  ACTIVITY_NAME_TO_NUMBER,
  ACTIVITY_SECKILL,
  ACTIVITY_SETMEAL,
  ACTIVITY_SETMEAL_NUMBER,
  ACTIVITY_SPECIALOFFER,
} from '@/constants/const/activity'
import { toFixedFix } from '@/utils/numberFormat'
import Button from '@/components/Commodity/button'
import styles from './index.module.scss'
import CommodityCard from '../ActivityCard'
import { GiveCoupon, GiveProduct, PromotionCombination } from '../ActivityTypeGroup'
import Combination from '../ActivityTypeGroup/combination'
import { CouponType } from '../ActivityTypeGroup/GiveCoupon'
import { EventGiveProductParameters } from '../ActivityTypeGroup/giveProduct'
import { EventCombinationParameters } from '../ActivityTypeGroup/PromotionCombination'
import SeckillList from '../ActivityTypeGroup/seckill'
import Exchange from '../ActivityTypeGroup/exchange'

export type DataSourceType = {
  /**
   * 活动商品ID
   */
  id: number
  /**
   * 活动ID
   */
  activityId: number
  /**
   * 赠送促销类型：1-满额赠2-买商品赠
   */
  giveType: number
  /**
   * 商品ID
   */
  productId: number
  /**
   * skuId
   */
  skuId: number
  /**
   * 商品名称
   */
  productName: string
  /**
   * 商品图片
   */
  productImgUrl: string
  /**
   * 规格
   */
  type: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 商品价格预售价格
   */
  price: number
  /**
   * 直降价格起始价格
   */
  plummetPrice: number
  /**
   * 活动价格团购价格秒杀价格单价定金砍价底价
   */
  activityPrice: number
  /**
   * 定金抵扣单价
   */
  deductionPrice: number
  /**
   * 折扣（如85折，输入85，9折输入90）
   */
  discount: number
  /**
   * 个人限购数量
   */
  restrictNum: number
  /**
   * 活动限购总数量
   */
  restrictTotalNum: number
  /**
   * 所属活动（key：id、name、type、belongType。value：活动ID、活动名称、活动类型、所属类型） ,Map
   */
  activityList: {}[]
  /**
   * 赠品（优惠卷） ,Map
   */
  giveCouponList: {}[]
  /**
   * 配套商品-组 ,ActivityGoodsSubsidiaryGroupResp
   */
  goodsSubsidiaryGroupList: {
    /**
     * 分组编号优惠阶梯换购阶梯
     */
    groupNo?: number
    /**
     * 换购门槛优惠门槛数量或金额
     */
    limitValue?: number
    /**
     * 套餐价格
     */
    groupPrice?: number
    /**
     * 配套商品-组明细 ,ActivityGoodsSubsidiaryGroupDetailsResp
     */
    goodsSubsidiaryGroupDetailsList?: {
      /**
       * id
       */
      id?: number
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
       * 换购价格
       */
      swapPrice?: number
      /**
       * 允许换购数量赠送数量搭配数量
       */
      num?: number
      /**
       * 赠品主图
       */
      productImgUrl?: string
    }[]
  }[]
  /** 会员折扣 */
  memberDiscount: number
}

type RowCommodityProps = React.ComponentProps<typeof RowCommodity>
type ActivityType = keyof typeof ACTIVITY_NAME_TO_NUMBER

/** 活动推荐 */
type HotActivity = 'hot'

type DataSourceItem = DataSourceType & {
  preferentialPrice: number
  label: string
  /** 已售/ 已送 */
  hasSold?: number
  /** 秒杀开始时间 */
  secKillStartTime?: number
  /** 秒杀结束时间 */
  secKillEndTime?: number
  max?: number
  min?: number
}

interface Iprops {
  theme: (0 | 1 | 2 | number) & {}
  title: string
  dataSource: DataSourceItem[]
  activityType: HotActivity | ActivityType
  /** 平台 、 商家 */
  belongType: 1 | 2
}

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'violet'

/** 活动对应 tag 类型 的 */
const ACTIVITY_MAP_TO_STYLE = {
  preSale: 'purple',
  specialOffer: 'violet',
  plummet: 'danger',
  secKill: 'violet',
  fullSwap: 'violet',
  buySwap: 'violet',
}

const WrapCommodity: React.FC<Iprops> = (props: Iprops) => {
  const { title, dataSource, activityType, belongType } = props
  const intl = useIntl()
  const { jmpProductDetail, jmpProductDetailGroup } = useProductDetailJump()
  /**
   * *默认的活动标签，如果不需要默认的活动标签，直接注释即可
   */
  const ACTIVITY_MAP_TO_NAME = {
    specialOffer: intl.formatMessage({ id: 'activity.type.specialOffer', defaultMessage: '特价促销' }),
    plummet: intl.formatMessage({ id: 'activity.type.plummet', defaultMessage: '直降促销' }),
    discount: intl.formatMessage({ id: 'activity.type.discount', defaultMessage: '折扣促销' }),
    fullQuantitySub: intl.formatMessage({ id: 'activity.type.fullQuantitySub', defaultMessage: '满量促销' }),
    fullQuantityDiscount: intl.formatMessage({ id: 'activity.type.fullQuantityDiscount', defaultMessage: '满量折' }),
    fullMoneySub: intl.formatMessage({ id: 'activity.type.fullMoneySub', defaultMessage: '满额减' }),
    fullMoneyDiscount: intl.formatMessage({ id: 'activity.type.fullMoneyDiscount', defaultMessage: '满额折' }),
    giveProduct: intl.formatMessage({ id: 'activity.type.giveProduct', defaultMessage: '赠送促销' }),
    giveCoupon: intl.formatMessage({ id: 'activity.type.giveCoupon', defaultMessage: '赠送优惠券' }),
    morePiece: intl.formatMessage({ id: 'activity.type.morePiece', defaultMessage: '多件促销' }),
    combination: intl.formatMessage({ id: 'activity.type.combination', defaultMessage: '组合促销' }),
    bargain: intl.formatMessage({ id: 'activity.type.bargain', defaultMessage: '砍价' }),
    secKill: intl.formatMessage({ id: 'activity.type.secKill', defaultMessage: '秒杀' }),
    fullSwap: intl.formatMessage({ id: 'activity.type.fullSwap', defaultMessage: '满额换购' }),
    buySwap: intl.formatMessage({ id: 'activity.type.buySwap', defaultMessage: '买商品换购' }),
    preSale: intl.formatMessage({ id: 'activity.type.preSale', defaultMessage: '预售' }),
    setMeal: intl.formatMessage({ id: 'activity.type.setMeal', defaultMessage: '套餐' }),
    attempt: intl.formatMessage({ id: 'activity.type.attempt', defaultMessage: '试用' }),
  }

  const BTN_TEXT = {
    secKill: intl.formatMessage({ id: 'activity.button.seckill', defaultMessage: '秒杀' }),
    bargain: intl.formatMessage({ id: 'activity.button.bargain', defaultMessage: '免费领' }),
    hot: intl.formatMessage({ id: 'activity.button.hot', defaultMessage: '立即购买' }),
    groupPurchase: intl.formatMessage({ id: 'activity.button.groupPurchase', defaultMessage: '立即拼团' }),
  }

  const renderProgress = (_item: DataSourceItem) => {
    const { hasSold = 0, restrictTotalNum } = _item
    const percent = toFixedFix((hasSold / restrictTotalNum) * 100, 2)
    const innerText = `${Math.floor(((restrictTotalNum - hasSold) / restrictTotalNum) * 100 * 100) / 100}%`
    const highlightText = activityType === ACTIVITY_BARGAIN ? hasSold : restrictTotalNum - hasSold
    const progressText =
      activityType === ACTIVITY_BARGAIN
        ? intl.formatMessage({ id: 'activity.text.hasSend', defaultMessage: '已送出' })
        : intl.formatMessage({ id: 'activity.text.surplus', defaultMessage: '剩余' })
    return (
      <View style={styles.progress}>
        <Progress
          strokeColor="#EF3346"
          trailColor="#FFF0F2"
          strokeWidth={6}
          percent={percent}
          customRenderText={
            <View className={styles['progress-container']}>
              <Text className={styles['progress-remain']}>{innerText}</Text>
              <View className={styles['progress-extra']}>
                <Text>{progressText}</Text>
                <Text className={styles['progress-extra-highlight']}>{highlightText}</Text>
                <Text>{_item.unit}</Text>
              </View>
            </View>
          }
        />
      </View>
    )
  }

  const generateDataSource = (data: DataSourceItem[]) => {
    const newDataSource = data.filter(Boolean)?.map((_item, _index) => {
      const topLabel =
        activityType === ACTIVITY_SPECIALOFFER && _index < 3
          ? {
              productTag: (
                <View className={styles.topLabelContainer}>
                  <Text className={styles[`product-tag-${_index + 1}`]}>{`Top${_index + 1}`}</Text>
                </View>
              ),
            }
          : {}

      const label: string[] = Array.isArray(_item.label) ? _item.label : [_item.label].filter(Boolean)

      /** 是否包含 互动类型标签 */
      const default_tags = ACTIVITY_MAP_TO_NAME[activityType as keyof typeof ACTIVITY_MAP_TO_NAME]
        ? [
            {
              name: ACTIVITY_MAP_TO_NAME[activityType as keyof typeof ACTIVITY_MAP_TO_NAME],
              type: (ACTIVITY_MAP_TO_STYLE[activityType as keyof typeof ACTIVITY_MAP_TO_STYLE] || 'danger') as 'danger',
            },
          ]
        : []

      const tags = {
        tags: default_tags.concat(
          [ACTIVITY_FULLSWAP, ACTIVITY_BUYSWAP].includes(activityType)
            ? []
            : label.map((_labelItem: string) => ({
                name: _labelItem,
                type: (ACTIVITY_MAP_TO_STYLE[activityType as keyof typeof ACTIVITY_MAP_TO_STYLE] ||
                  'danger') as 'danger',
              })),
        ),
      }

      let extra = {}
      /** 如果是活动热荐，或者砍价, 那么带上进度条 */
      if ([ACTIVITY_HOT, ACTIVITY_BARGAIN].includes(activityType)) {
        extra = {
          renderMiddleArea: renderProgress(_item),
        }
      }

      const withButtonText = BTN_TEXT[activityType] ? { buttonText: BTN_TEXT[activityType] } : {}

      const withCouponList =
        activityType === ACTIVITY_GIVECOUPON
          ? {
              coupon: _item.giveCouponList as unknown as CouponType[],
              /** giveType 区分是元还是件 ，1.满额赠，单位元， 2.商品赠，单位件  */
              giveType: _item.giveType,
            }
          : {}

      const withGiveProductList =
        activityType === ACTIVITY_GIVEPRODUCT
          ? {
              giveProduct: _item.goodsSubsidiaryGroupList,
              /** giveType 区分是元还是件 ，1.满额赠，单位元， 2.商品赠，单位件  */
              giveType: _item.giveType,
            }
          : {}

      const withSuit = activityType === ACTIVITY_SETMEAL ? { suit: _item.goodsSubsidiaryGroupList } : {}

      /** 秒杀时间 */
      const withSeckillTime =
        activityType === ACTIVITY_SECKILL
          ? { secKillStartTime: _item.secKillStartTime, secKillEndTime: _item.secKillEndTime }
          : {}

      /** 换购 */
      const withExchange = [ACTIVITY_FULLSWAP, ACTIVITY_BUYSWAP].includes(activityType)
        ? {
            exchange: _item.goodsSubsidiaryGroupList,
            /** giveType 区分是元还是件 ，1.满额赠，单位元， 2.商品赠，单位件  */
            giveType: _item.giveType ?? (activityType === ACTIVITY_FULLSWAP ? 1 : 2),
          }
        : {}

      /** 原价  */
      const originalPrice = _item.price

      /** 活动价, 已经乘了会员折扣价 */
      const showPrice = +_item.activityPrice

      return {
        activityList: _item.activityList || [],
        skuId: _item.skuId,
        productName: _item.productName,
        productImg: _item.productImgUrl,
        id: _item.id,
        originalPrice: originalPrice,
        discount: showPrice,
        productId: _item.productId,
        buttonType:
          (ACTIVITY_MAP_TO_STYLE[activityType as keyof typeof ACTIVITY_MAP_TO_STYLE] as ButtonType) || 'danger',
        hasSold: _item.hasSold,
        restrictTotalNum: _item.restrictTotalNum,
        unit: _item.unit,
        min: _item.min,
        max: _item.max,
        ...topLabel,
        ...tags,
        ...extra,
        ...withButtonText,
        ...withCouponList,
        ...withSuit,
        ...withGiveProductList,
        ...withSeckillTime,
        ...withExchange,
      }
    })
    return newDataSource
  }

  const newDataSource = activityType !== ACTIVITY_COMBINATION ? generateDataSource(dataSource) : dataSource

  // console.log(newDataSource, 'newDataSourcenewDataSource')

  const handleBuyCommodity = (dataProps: any) => {
    const skuId = dataProps.skuId ? { skuId: dataProps.skuId } : {}
    if (activityType === 'groupPurchase') {
      jmpProductDetailGroup({ commodityId: dataProps.productId, ...skuId })
      return
    }
    const activityTypeNumber = ACTIVITY_NAME_TO_NUMBER[activityType]
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
      commodityId: dataProps.productId,
      ...skuId,
      activityType: activityTypeNumber,
    })
  }

  /** 赠送商品 */
  const handleBuyGiveProduct = (data: EventGiveProductParameters) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
      commodityId: data.main.productId,
      skuId: data.main.skuId,
    })
  }

  /** 购买套装 */
  const handleBuySetMeal = (data: EventCombinationParameters) => {
    /** 套装带上活动id */
    const activityTarget = (data.main as any).activityList?.find(
      (_item: any) => _item.activityType === ACTIVITY_NAME_TO_NUMBER[activityType as 'setMeal'],
    )
    const withActivityId = activityTarget ? { activityId: activityTarget.id } : {}
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
      commodityId: data.main.productId,
      skuId: data.main.skuId,
      belongType,
      activityType: ACTIVITY_NAME_TO_NUMBER[activityType],
      ...withActivityId,
    })
  }
  const renderRowCommodity = () => {
    return (
      <>
        {newDataSource.map((_item) => {
          const itemProps = _item as RowCommodityProps
          return (
            <View key={_item.id} className={styles['give-product-item']}>
              <RowCommodity {...itemProps} onBuy={handleBuyCommodity} onClickCommodity={handleBuyCommodity} />
            </View>
          )
        })}
      </>
    )
  }

  const renderColumnCommodity = () => {
    return <ColumnCommodity dataSource={newDataSource as any} />
  }

  /** 赠送商品*/
  const renderGiveProduct = () => {
    return (
      <>
        {newDataSource.map((_item) => {
          return (
            <View className={styles['give-product-item']} key={_item.id}>
              <GiveProduct {..._item} onClick={handleBuyGiveProduct} />
            </View>
          )
        })}
      </>
    )
  }

  /** 赠送优惠券 */
  const renderCoupon = () => {
    return (
      <>
        {newDataSource.map((_item) => {
          return (
            <View className={styles['give-product-item']} key={_item.id}>
              <GiveCoupon {..._item} onClick={handleBuyGiveProduct} />
            </View>
          )
        })}
      </>
    )
  }

  /*** 套装 */
  const renderGroupSale = () => {
    return (
      <>
        {newDataSource.map((_item) => {
          return (
            <View className={styles['give-product-item']} key={_item.id}>
              <PromotionCombination
                {..._item}
                // isExchange={isExchange}
                onClick={handleBuySetMeal}
              />
            </View>
          )
        })}
      </>
    )
  }

  // /** 换购 */
  // const renderExchange = () => {
  //   return (
  //     <>
  //       {
  //         newDataSource.map((_item) => {
  //           return (
  //             <View className={styles['give-product-item']} key={_item.id}>
  //               <Exchange
  //                 {..._item}
  //                 onClick={handleBuySetMeal}
  //               />
  //             </View>
  //           )
  //         })
  //       }
  //     </>
  //   )
  // }

  /**
   * 组合促销
   */
  const renderCombination = () => {
    return (
      <>
        {newDataSource.map((_item, _index) => {
          const combinationDataSource = generateDataSource(_item as any)
          if (combinationDataSource.length === 0) {
            return null
          }
          return (
            <View key={_index} className={styles['give-product-item']}>
              <Combination dataSource={combinationDataSource as any} belongType={belongType} />
            </View>
          )
        })}
      </>
      // <Combination dataSource={newDataSource} />
    )
  }

  const renderDataSource = () => {
    if (
      [
        'hot',
        'specialOffer',
        'plummet',
        'discount',
        'groupPurchase',
        'bargain',
        'preSale',
        'attempt',
        'morePiece',
        'buySwap',
        'fullSwap',
      ].includes(activityType)
    ) {
      return renderRowCommodity()
    }
    if (['fullQuantitySub', 'fullQuantityDiscount', 'fullMoneySub', 'fullMoneyDiscount'].includes(activityType)) {
      return renderColumnCommodity()
    }
    if ('giveProduct' === activityType) {
      return renderGiveProduct()
    }

    if ('giveCoupon' === activityType) {
      return renderCoupon()
    }

    if (activityType === ACTIVITY_SECKILL) {
      return <SeckillList dataSource={newDataSource as any} />
    }

    if (ACTIVITY_COMBINATION === activityType) {
      return renderCombination()
    }

    if (['setMeal'].includes(activityType)) {
      return renderGroupSale()
    }

    // if (['buySwap', 'fullSwap'].includes(activityType)) {
    //   return renderExchange();
    // }

    if (activityType.includes('suggestProduct')) {
      return renderRowCommodity()
    }

    return null
  }

  return (
    <View className={styles.container}>
      <CommodityCard title={title}>{renderDataSource()}</CommodityCard>
    </View>
  )
}

export default WrapCommodity
