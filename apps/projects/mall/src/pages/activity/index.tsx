import React, { useEffect } from 'react'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import { useParams } from 'react-router-dom'
import { getWebIntl } from '@/utils/locales'
import useActivityLayout from './hooks/useActivityLayout'
import CommodityList from './components/Commodity/list'
import Coupon from './components/Coupon'
import Expired from './components/Expired'
import Loading from './components/Loading'
import Picture from './components/Picture'
import styles from './index.module.less'

type CouponType = React.ComponentProps<typeof Coupon>

const ComponentMap: any = {
  top: Picture,
  commodityList: CommodityList,
}

/** 以下类型的全部为ComponentList 组件 */
const ACTIVITY_TYPE = [
  'hot',
  'specialOffer',
  'plummet',
  'discount',
  'fullQuantitySub',
  'fullQuantityDiscount',
  'fullMoneySub',
  'fullMoneyDiscount',
  'giveProduct',
  'giveCoupon',
  'morePiece',
  'combination',
  'groupPurchase',
  'bargain',
  'secKill',
  'fullSwap',
  'buySwap',
  'preSale',
  'setMeal',
  'attempt',
]

const Activity: React.FC = () => {
  const { mallInfo, currentCity } = useGlobalConext()
  const { id } = useParams()
  const { activityData, layout, info, pageLoading, isExpired } = useActivityLayout(id, currentCity)
  const translate = getWebIntl()

  if (isExpired) {
    return <Expired />
  }

  if (pageLoading || activityData.length === 0) {
    return <Loading />
  }
  // -${mallInfo?.name}

  return (
    <HelmetProvider title={info!.name ? info!.name : translate('web.resource.mall.huodongye')}>
      <div className={styles.page} style={{ backgroundColor: layout?.['themeStyle'].props.color || '#E34D59' }}>
        {activityData.map((_item: any, _index: number) => {
          const componentName =
            ACTIVITY_TYPE.includes(_item.name) || _item.name.includes('suggestProduct') ? 'commodityList' : _item.name

          if (componentName === 'coupon') {
            return (
              <div key={'coupon'} className={styles.couponListContainer}>
                <div className={styles.couponList}>
                  {_item.dataSource.map((_couponItem: CouponType) => {
                    return (
                      <div className={styles.couponItem} key={_couponItem.id}>
                        <Coupon {..._couponItem} shopId={info?.shopId!} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
          const Component = ComponentMap[componentName]
          if (!Component) {
            return null
          }

          return (
            <Component key={`${_item.name}-${_index}`} {..._item} activityType={_item.name} shopId={info?.shopId} />
          )
        })}
      </div>
    </HelmetProvider>
  )
}

export default Activity
