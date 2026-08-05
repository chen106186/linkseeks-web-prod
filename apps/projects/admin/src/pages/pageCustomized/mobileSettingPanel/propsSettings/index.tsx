import React from 'react'
import { SelectedInfoType, PROPS_SETTING_TYPES, PageConfigType } from '@apps/design-core'
import HeaderNav from './components/headerNav'
import HeaderNavAction from './components/headerNavAction'
import Banner from './components/banner'
import QuickNav from './components/quickNav'
import ShowCase from './components/showCase'
import Shops from './components/shops'
import Quality from './components/quality'
import BottomNavigation from './components/bottomNavigation'
import MarketingCardHeader from './components/marketingCardHeader'
import MarketingCardCoupon from './components/marketingCardCoupon'
import MarketingCardGood from './components/marketingCardGood'
import BottomNavigationClient from './components/bottomNavigationClient'
import CouponsModal from './components/couponsModal'
import BannerClient from './components/bannerClient'
import SuggestProduct from './components/suggestProduct'
import SuggestProductCommodity from './components/suggestProductCommodity'
import CardNavItem from './components/cardNavItem'
import ClassifyLabel from './components/ClassifyLabel'
import MobileQualityCommodityList from './components/mobileQualityCommodityList'
import MobileQualityBrandList from './components/mobileQualityBrandList'
import MobileQualityInformationList from './components/mobileQualityInformationList'
import styles from './index.less'

interface PropsSettingsPropsType {
  selectedInfo: SelectedInfoType | undefined
  pageConfig: PageConfigType
  shopId: number
  property: number
  environment: number
}

const PropsSettings: React.FC<PropsSettingsPropsType> = (props) => {
  const { selectedInfo, pageConfig, shopId, environment, property } = props
  const renderSettingItem = () => {
    const { props: initProps, propsConfig, parentKey } = selectedInfo || {}
    const _props = { ...initProps, shopId, environment, property, selectedKey: selectedInfo?.selectedKey }
    const componentType = propsConfig?.componentType
    if (componentType) {
      switch (componentType.type) {
        case PROPS_SETTING_TYPES.mobileHeaderNav:
          return <HeaderNav {..._props} />
        case PROPS_SETTING_TYPES.mobileBanner:
          return <Banner {..._props} />
        case PROPS_SETTING_TYPES.mobileQuickNav:
          return <QuickNav {..._props} />
        case PROPS_SETTING_TYPES.mobileShowCase:
          return <ShowCase {..._props} />
        case PROPS_SETTING_TYPES.mobileQualityShopList:
        case PROPS_SETTING_TYPES.mobileRecommentShops:
        case PROPS_SETTING_TYPES.suggestProductStore:
          return <Shops {..._props} />
        case PROPS_SETTING_TYPES.mobileQuality:
          return <Quality {..._props} />
        case PROPS_SETTING_TYPES.mobileBottomNavigation:
          return <BottomNavigation {..._props} />
        case PROPS_SETTING_TYPES.marketingCardHeader:
          return <MarketingCardHeader {..._props} />
        case PROPS_SETTING_TYPES.marketingCardCoupon:
          return <MarketingCardCoupon {..._props} pageConfig={pageConfig} />
        case PROPS_SETTING_TYPES.marketingCardGood:
        case PROPS_SETTING_TYPES.marketingCardGiveContainerItem:
        case PROPS_SETTING_TYPES.marketingCardDetailItem: {
          const _parentKey: any = parentKey
          const _type = pageConfig?.[_parentKey]?.props?.type
          const _exType = pageConfig?.[_parentKey]?.props?.exType
          return <MarketingCardGood {..._props} actType={_type} exType={_exType} pageConfig={pageConfig} />
        }
        case PROPS_SETTING_TYPES.bottomNavigationItems:
          return <BottomNavigationClient {..._props} />
        case PROPS_SETTING_TYPES.couponsModal:
          return <CouponsModal {..._props} pageConfig={pageConfig} />
        case PROPS_SETTING_TYPES.bannerItems:
          return <BannerClient {..._props} />
        case PROPS_SETTING_TYPES.suggestProductItems:
          if (property === 2) {
            return <SuggestProduct {..._props} />
          } else if (property === 1) {
            return <ClassifyLabel {..._props} pageConfig={pageConfig} />
          }
          break
        case PROPS_SETTING_TYPES.mobileHeaderNavAction:
          return <HeaderNavAction {..._props} />
        case PROPS_SETTING_TYPES.suggestProductCommodity:
          return <SuggestProductCommodity {..._props} />
        case PROPS_SETTING_TYPES.mobileNavCardNavItem:
          return <CardNavItem {..._props} />
        case PROPS_SETTING_TYPES.mobileQualityCommodityList:
          return <MobileQualityCommodityList {..._props} />
        case PROPS_SETTING_TYPES.mobileQualityBrandList:
        case PROPS_SETTING_TYPES.suggestProductBrand:
          return <MobileQualityBrandList {..._props} />
        case PROPS_SETTING_TYPES.mobileQualityInformationList:
        case PROPS_SETTING_TYPES.suggestProductInformation:
          return <MobileQualityInformationList {..._props} />
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
