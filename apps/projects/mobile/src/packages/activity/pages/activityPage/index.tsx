import React from 'react'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import styles from './index.module.scss'
import useActivityLayout from './useActivityLayout'
import ActivityImage from './components/ActivityImage'
import CommodityList from './components/CommodityList'
import Coupon from './components/Coupon'
import { usePageInit } from '@/hooks/usePageInit'
import { useShareAppMessage } from '@tarojs/taro'
import { shareAppMessage } from '@/utils/share'

const ComponentMap: any = {
  top: ActivityImage,
  // coupon: Coupon,
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

const Activity = () => {
  const router = useRouter<{ id: string }>()
  const { id } = router?.params || {}
  const {
    locationStore: { currentCity },
    userStore: { userInfo },
  } = useStores()
  const { activityData, layout, info } = useActivityLayout(+id, { currentCity: currentCity!, userInfo: userInfo })
  const background = layout?.themeStyle?.props?.color
  const backgroundColorStyle = layout
    ? {
        background: background,
      }
    : {
        background: '#red',
      }

  usePageInit()
  useShareAppMessage((res) =>
    shareAppMessage(res, info?.name, `/packages/activity/pages/activityPage/index?id=${id}`, ''),
  )
  return (
    <PageLayout
      className={styles['pageLayout']}
      style={backgroundColorStyle}
      renderHeader={<NavBar title={info?.name} />}
    >
      {activityData.map((_item: any, _index: number) => {
        const componentName =
          ACTIVITY_TYPE.includes(_item.name) || _item.name.includes('suggestProduct') ? 'commodityList' : _item.name

        if (componentName === 'coupon') {
          return (
            <Coupon
              key={`${_item.name}-${_index}`}
              activityId={+id}
              dataSource={_item.dataSource}
              shopId={info?.shopId!}
            />
          )
        }

        const Component = ComponentMap[componentName]

        if (!Component) {
          return null
        }
        return (
          <Component
            key={`${_item.name}-${_index}`}
            {..._item}
            activityType={_item.name}
            shopId={info?.shopId}
            belongType={info?.type}
          />
        )
      })}
    </PageLayout>
  )
}

export default observer(Activity)
