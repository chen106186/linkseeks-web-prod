import React, { useMemo } from 'react'
import omit from 'lodash/omit'
import { ACTIVITY_NAME_TO_NUMBER } from '@/constants/marketing'
import { getWebIntl } from '@/utils/locales'
import Price from './price'
import Label from '../Label'
import styles from './index.module.less'

type TypeofActivity = typeof ACTIVITY_NAME_TO_NUMBER

export type ActivityItem = {
  /** 活动类型 */
  activityType: TypeofActivity[keyof TypeofActivity]
  activityName: string
  /** 活动id */
  id: number
  /** 满量折，满量减， 赠送商品等， 赠送优惠券 */
  minType?: 1 | 2
}

export type GroupProductItem = {
  brand: string
  category: string
  id: number
  num: number
  price: number
  productId: number
  productImgUrl: string
  productName: string
  skuId: number
  swapPrice: number | null
  unit: string
}

export type GroupItem = {
  groupNo: number
  groupPrice: number
  limitValue: number
  goodsSubsidiaryGroupDetailsList: GroupProductItem[]
}

export type CommodityData = {
  activityList: ActivityItem[]
  goodsSubsidiaryGroupList: GroupItem[]
  /** 活动价 */
  activityPrice: null | number
  /** 品牌 */
  brand: string
  /** 品类 */
  category: string
  /** 定金抵扣单价  */
  deductionPrice: null | number
  /** 折扣 */
  discount: null | string
  /** 赠送促销类型：1-满额赠2-买商品赠 */
  giveType: 1 | 2 | number
  /** 已售 */
  hasSold: null | number
  /** 主键id */
  id: number
  /** tag */
  label: string
  /** 商家id */
  memberId: number
  /** 商家名 */
  memberName: string
  /** 直降价格起始价格 */
  plummetPrice: null | number
  /** 预售价格 */
  preSalePrice: null | number
  /** 优惠价？ 拼团 */
  preferentialPrice: number
  /** 原价 */
  price: number
  /** 商品id */
  productId: number
  /** 商品图片 */
  productImgUrl: string
  /** 商品名 */
  productName: string
  /** 个人限购数量 */
  restrictNum: number
  /** 活动限购总数量 */
  restrictTotalNum: number
  /** 商家角色id */
  roleId: number
  /** skuid */
  skuId: number
  /** 规格 */
  type: null
  /** 单位 */
  unit: string
  stockCount: number
  minOrder: number
}

interface CommodityDataProps extends CommodityData {
  onClick?: (data: CommodityData) => void
}

const Commodity: React.FC<CommodityDataProps> = (props: CommodityDataProps) => {
  const translate = getWebIntl()
  const {
    productImgUrl,
    productName,
    activityPrice,
    preferentialPrice,
    label,
    price,
    hasSold,
    unit,
    onClick,
    stockCount = 0,
    minOrder = 0,
  } = props

  const commodityActivityPrice = useMemo(() => {
    return activityPrice || preferentialPrice || price
  }, [activityPrice, preferentialPrice, price])

  const labelList = Array.isArray(label) ? label : [label]

  const handleClick = () => {
    const commodityData = omit(props, 'onClick')
    onClick?.(commodityData)
  }

  return (
    <div className={styles.commodity} onClick={handleClick}>
      <img className={styles['commodity-image']} src={productImgUrl} />
      {minOrder === 0 || (stockCount === 0 && <div className={styles['mask-box']}>补货中</div>)}

      <div className={styles['commodity-info']}>
        <div className={styles['commodity-info-name']}>{productName}</div>
        <div className={styles['commodity-info-tags']}>
          {labelList
            .filter((_item) => Boolean(_item))
            .map((_item, key) => {
              return (
                <div className={styles['commodity-info-tags-item']} key={key}>
                  <Label mode="ghost" type="danger" name={_item} />
                </div>
              )
            })}
        </div>
        <div className={styles['commodity-info-price']}>
          <Price originalPrice={price} discountPrice={commodityActivityPrice} unit={unit} />
        </div>
        <div className={styles['commodity-info-hasBuy']}>
          {translate('web.resource.mall.sold')}
          {`${hasSold || 0}${unit}`}
        </div>
      </div>
    </div>
  )
}

export default Commodity
