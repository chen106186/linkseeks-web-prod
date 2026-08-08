import React from 'react'
import cx from 'classnames'
import { ACTIVITY_GROUPPURCHASE_NUMBER, ACTIVITY_NAME_TO_NUMBER } from '@/constants/marketing'
import { getProductShopStoreGetCommodityDetailBySkuId } from '@apps/apis'
import HotCommodity from './hotCommodity'
import MealCommodity from './mealCommodity'
import Commodity, { CommodityData } from '.'
import WebCard from '../WebCard'
import styles from './list.module.less'
import { LinkTo } from '@/utils'
import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import useLink from '@/hooks/useLink'

type TypeofActivity = typeof ACTIVITY_NAME_TO_NUMBER
type ActivityHot = 'hot'
type OtherActivity = keyof TypeofActivity

type ActivityType = ActivityHot | OtherActivity

type ActivityItem = {
  /** 活动类型 */
  activityType: TypeofActivity[keyof TypeofActivity]
  activityName: string
  /** 活动id */
  id: number
  /** 满量折，满量减， 赠送商品等， 赠送优惠券 */
  minType?: 1 | 2
}
interface Iprops {
  activityType: ActivityType
  theme: (0 | 1 | 2 | number) & {}
  title: string
  dataSource: CommodityData[]
  shopId: string
}

const List: React.FC<Iprops> = (props: Iprops) => {
  const { dataSource, title, activityType, shopId } = props
  const { layoutType } = useGlobalConext()
  const { linkPrefix } = useLink()

  /**
   * 获取店铺id
   */
  const getStoreIdBySkuId = (skuId: string) => {
    return new Promise((resolve) => {
      getProductShopStoreGetCommodityDetailBySkuId({ commoditySkuId: skuId }, { headers: { shopId } })
        .then((res) => {
          resolve(res.data?.storeId)
        })
        .catch(() => {
          resolve(undefined)
        })
    })
  }

  const handleJumpToCommodity = async (data: CommodityData) => {
    let path = 'commodity'
    if (data.activityList && Array.isArray(data.activityList) && data.activityList.length > 0) {
      const isGroupPhase = data.activityList.some(
        (_item: ActivityItem) => _item.activityType === ACTIVITY_GROUPPURCHASE_NUMBER,
      )
      if (isGroupPhase) {
        path = 'group'
      }
    }
    if (data.skuId) {
      if (layoutType === LAYOUT_TYPE.own) {
        LinkTo(linkPrefix(`/${path}/detail/${data.productId}?skuId=${data.skuId}`), 'open')
      } else {
        const storeId = await getStoreIdBySkuId(String(data.skuId))
        if (storeId) {
          LinkTo(linkPrefix(`/shop/${storeId}/${path}/detail/${data.productId}?skuId=${data.skuId}`), 'open')
        }
      }
    }
  }

  if (activityType === 'hot') {
    return (
      <div className={styles['hot-container']}>
        <WebCard title={<div className={styles['hot-container-title']}>{title}</div>}>
          <HotCommodity dataSource={dataSource} onClick={handleJumpToCommodity as any} />
        </WebCard>
      </div>
    )
  }

  if (activityType === 'setMeal') {
    return (
      <div className={styles.container}>
        <WebCard title={title}>
          <div className={styles.commodityList}>
            {dataSource.map((_item) => {
              return (
                <div className={cx(styles.commodityItem, styles.meal)} key={_item.id}>
                  <MealCommodity {..._item} onClick={handleJumpToCommodity} />
                </div>
              )
            })}
          </div>
        </WebCard>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <WebCard title={title}>
        <div className={styles.commodityList}>
          {dataSource.map((_item) => {
            return (
              <div className={styles.commodityItem} key={_item.id}>
                <Commodity {..._item} onClick={handleJumpToCommodity} />
              </div>
            )
          })}
        </div>
      </WebCard>
    </div>
  )
}

export default List
