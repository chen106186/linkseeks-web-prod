import React from 'react'
import { SelectedInfoType, PROPS_SETTING_TYPES, PageConfigType } from '@apps/design-core'
import Banner from './components/banner'
import QuickNav from './components/quickNav'
import HeadBackground from './components/headBackground'
import RecommendCommodity from './components/recommendCommodity'
import BottomNavigation from './components/bottomNavigation'
import MobileChannelGoods from './components/channelGoods'
import MobileChannelInformation from './components/channelInformation'
import CardNavItem from './components/cardNavItem'
import CouponsModal from './components/couponsModal'
import MarketingCardCoupon from './components/marketingCardCoupon'
import MarketingCardGood from './components/marketingCardGood'
import MarketingCardHeader from './components/marketingCardHeader'
import BottomNavigationClient from './components/bottomNavigationClient'
import SuggestProduct from './components/suggestProduct'
import SuggestProductCommodity from './components/suggestProductCommodity'
import BrandList from './components/brandList'
import { LAYOUT_TYPE } from '@/constants'
import styles from './index.less'

interface PropsSettingsPropsType {
  selectedInfo: SelectedInfoType | undefined
  pageConfig: PageConfigType
  layoutType: LAYOUT_TYPE
  shopId: number
  environment: number
}

const PropsSettings: React.FC<PropsSettingsPropsType> = (props) => {
  const { selectedInfo, shopId, environment, layoutType, pageConfig } = props

  const renderSettingItem = () => {
    const { props: initProps, propsConfig, parentKey } = selectedInfo || {}
    const _props = { ...initProps, shopId, environment, layoutType, selectedKey: selectedInfo?.selectedKey }
    const componentType = propsConfig?.componentType

    if (componentType) {
      switch (componentType.type) {
        case PROPS_SETTING_TYPES.mobileShopHeaderNav:
          return <HeadBackground {..._props} />
        case PROPS_SETTING_TYPES.mobileShopCommodity:
          return <RecommendCommodity {..._props} />
        case PROPS_SETTING_TYPES.bannerItems:
          return <Banner {..._props} />
        case 'mobileChannelBanner':
          return <Banner {..._props} type="channel" />
        case PROPS_SETTING_TYPES.mobileQuickNav:
          return <QuickNav {..._props} />
        case PROPS_SETTING_TYPES.mobileChannelGoodsCard:
          return <MobileChannelGoods {..._props} />
        case PROPS_SETTING_TYPES.moibileChannelInformation:
          return <MobileChannelInformation {..._props} />
        case PROPS_SETTING_TYPES.mobileBottomNavigation:
          return <BottomNavigation {..._props} />
        case PROPS_SETTING_TYPES.mobileNavCardNavItem:
          return <CardNavItem {..._props} />
        case PROPS_SETTING_TYPES.couponsModal:
          return <CouponsModal {..._props} pageConfig={pageConfig} />
        case PROPS_SETTING_TYPES.marketingCardHeader:
          return <MarketingCardHeader {..._props} />
        case PROPS_SETTING_TYPES.marketingCardCoupon:
          return <MarketingCardCoupon {..._props} pageConfig={pageConfig} />
        case PROPS_SETTING_TYPES.marketingCardGood:
        case PROPS_SETTING_TYPES.marketingCardGiveContainerItem:
        case PROPS_SETTING_TYPES.marketingCardDetailItem:
          const _parentKey: any = parentKey
          const _type = pageConfig?.[_parentKey]?.props?.type
          const _exType = pageConfig?.[_parentKey]?.props?.exType
          return <MarketingCardGood {..._props} actType={_type} exType={_exType} pageConfig={pageConfig} />
        case PROPS_SETTING_TYPES.bottomNavigationItems:
          return <BottomNavigationClient {..._props} />
        case PROPS_SETTING_TYPES.suggestProductItems:
          return <SuggestProduct {..._props} />
        case PROPS_SETTING_TYPES.suggestProductCommodity:
          return <SuggestProductCommodity {..._props} />
        case PROPS_SETTING_TYPES.mobileQualityBrandList:
          return <BrandList {..._props} />
        default:
          return null
      }
    }
  }

  return (
    <div className={styles.propsSettingsWrapper}>
      <div className={styles.propsSettingsBody}>{renderSettingItem()}</div>
    </div>
  )
}

export default PropsSettings
