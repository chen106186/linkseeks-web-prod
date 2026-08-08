import React from 'react'
import cx from 'classnames'

import CouponsItem from './CouponsItem'
import GoodsItem from './GoodsItem'
import DetailItem from './DetailItem'
import Header from './Header'
import ChannelHeader from './ChannelHeader'
import ShopHeader from './ShopHeader'
import CollageContainer from './CollageContainer'
import CollageContainerItem from './CollageContainerItem'
import CommonContainer from './CommonContainer'
import VerticalContainer from './VerticalContainer'
import PackageContainer from './PackageContainer'
import PackageContainerTabs from './PackageContainerTabs'
import PackageContainerTabsTabPane from './PackageContainerTabsTabPane'
import GiveContainer from './GiveContainer'
import GiveContainerItem from './GiveContainerItem'
import GiveContainerItemCoupon from './GiveContainerItemCoupon'

import styles from './index.less'

interface MarketingCardProps {
  children?: React.ReactNode[]
  className?: any
  shopColorType?: number
}

type ItemProps = {
  CouponsItem: typeof CouponsItem
  GoodsItem: typeof GoodsItem
  DetailItem: typeof DetailItem
  Header: typeof Header
  ChannelHeader: typeof ChannelHeader
  ShopHeader: typeof ShopHeader
  CollageContainer: typeof CollageContainer
  CollageContainerItem: typeof CollageContainerItem
  CommonContainer: typeof CommonContainer
  VerticalContainer: typeof VerticalContainer
  PackageContainer: typeof PackageContainer
  PackageContainerTabs: typeof PackageContainerTabs
  PackageContainerTabsTabPane: typeof PackageContainerTabsTabPane
  GiveContainer: typeof GiveContainer
  GiveContainerItem: typeof GiveContainerItem
  GiveContainerItemCoupon: typeof GiveContainerItemCoupon
}

const MarketingCard: React.FC<MarketingCardProps> & ItemProps = (
  props: MarketingCardProps,
) => {
  const { children, className, shopColorType, ...other } = props
  return (
    <div
      className={cx(
        styles[`lingxi-marketingCard`],
        shopColorType && styles[`shop-color-type-${shopColorType}`],
        className,
      )}
      {...other}
    >
      {children}
    </div>
  )
}

MarketingCard.CouponsItem = CouponsItem
MarketingCard.GoodsItem = GoodsItem
MarketingCard.DetailItem = DetailItem
MarketingCard.Header = Header
MarketingCard.ChannelHeader = ChannelHeader
MarketingCard.ShopHeader = ShopHeader
MarketingCard.CollageContainer = CollageContainer
MarketingCard.CollageContainerItem = CollageContainerItem
MarketingCard.CommonContainer = CommonContainer
MarketingCard.PackageContainer = PackageContainer
MarketingCard.PackageContainerTabs = PackageContainerTabs
MarketingCard.PackageContainerTabsTabPane = PackageContainerTabsTabPane
MarketingCard.VerticalContainer = VerticalContainer
MarketingCard.GiveContainer = GiveContainer
MarketingCard.GiveContainerItem = GiveContainerItem
MarketingCard.GiveContainerItemCoupon = GiveContainerItemCoupon

export default MarketingCard
