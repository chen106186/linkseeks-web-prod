import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Drawer, message } from 'antd'
import {
  SelectedInfoType,
  clearSelectedStatus,
  STATE_PROPS,
  PageConfigType,
  SelectedInfoBaseType,
  selectComponent,
  PROPS_SETTING_TYPES,
  produce,
  addComponentByName,
} from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import AdvertSetting from './components/AdvertSetting'
import PlatformAdvertSetting from './components/PlatformAdvertSetting'
import PlatformQuickNavSetting from './components/PlatformQuickNavSetting'
import PlatformGoods from './components/PlatformGoods'
import PlatformBrand from './components/PlatformBrand'
import PlatformMerchant from './components/PlatformMerchant'
import PlatformLogistics from './components/PlatformLogistics'
import PlatformProcess from './components/PlatformProcess'
import PlatformService from './components/PlatformService'
import PlatformInformation from './components/PlatformInformation'
import MallNav from './components/MallNav'
import HotspotImage from './components/HotspotImage'
import CommodityFloor from './components/CommodityFloor'
import CommodityStoreFloor from './components/CommodityStoreFloor'
import RichText from './components/RichText'
import Empty from './components/Empty'
import VisibleSwitch from './components/VisibleSwitch'
import HorizontalBanner from './components/HorizontalBanner'
import CarouselBanner from './components/CarouselBanner'
import AddComponents from './components/AddComponents'
import Coupon from './components/Coupon'
import CommodityRecommend from './components/CommodityRecommend'
import Footer from './components/Footer'
import './index.less'

interface PropsSettingsPropsType {
  layoutType: LAYOUT_TYPE
  selectedInfo?: SelectedInfoType
  adornId: number
}

const PropsSettings: React.FC<PropsSettingsPropsType> = (props) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [drawerTitle, setDrawerTitle] = useState<string>('')
  const [drawerWidth, setDrawerWidth] = useState<number>(800)
  const { selectedInfo, adornId, layoutType } = props
  const { pageConfig } = useSelector<{ pageConfig: PageConfigType }, STATE_PROPS>(['pageConfig'])

  const onClose = () => {
    setDrawerVisible(false)
    clearSelectedStatus()
  }

  const renderDrawerComponent = () => {
    const { props: initProps, propsConfig, selectedKey } = selectedInfo || {}
    const componentType = propsConfig?.componentType
    if (componentType) {
      switch (componentType.type) {
        case PROPS_SETTING_TYPES.categoryBanner:
        case PROPS_SETTING_TYPES.advert:
          return <AdvertSetting adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.mallNav:
          return <MallNav adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformAdvert:
          return <PlatformAdvertSetting adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformQuickNav:
          return <PlatformQuickNavSetting adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformGoods:
          return <PlatformGoods adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformBrand:
          return <PlatformBrand adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformMechant:
          return <PlatformMerchant adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformPurchaseAdvert:
          return <PlatformAdvertSetting adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformLogistics:
          return <PlatformLogistics adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformProcess:
          return <PlatformProcess adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformService:
          return <PlatformService adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.platformInformation:
          return <PlatformInformation adornId={adornId} {...initProps} />
        case PROPS_SETTING_TYPES.addComponentsButton:
          return <AddComponents {...initProps} layoutType={layoutType} />
        case PROPS_SETTING_TYPES.carouselBanner:
          return <CarouselBanner {...initProps} />
        case PROPS_SETTING_TYPES.horizontalBanner:
          return <HorizontalBanner {...initProps} />
        case PROPS_SETTING_TYPES.information:
        case PROPS_SETTING_TYPES.findMore:
          return <VisibleSwitch {...initProps} />
        case PROPS_SETTING_TYPES.empty:
          return <Empty {...initProps} />
        case PROPS_SETTING_TYPES.richText:
          return <RichText {...initProps} />
        case PROPS_SETTING_TYPES.commodityFloor:
          return <CommodityFloor {...initProps} />
        case PROPS_SETTING_TYPES.commodityStoreFloor:
          return <CommodityStoreFloor {...initProps} />
        case PROPS_SETTING_TYPES.hotspotImage:
          return <HotspotImage {...initProps} />
        case PROPS_SETTING_TYPES.coupon:
          return <Coupon {...initProps} />
        case PROPS_SETTING_TYPES.horizontalCommodity:
        case PROPS_SETTING_TYPES.verticalCommodity:
          return <CommodityRecommend {...initProps} />
        case PROPS_SETTING_TYPES.mallFooter:
          return <Footer {...initProps} />
      }
    }
    return null
  }

  useEffect(() => {
    const { propsConfig } = selectedInfo || {}

    const componentType = propsConfig?.componentType
    if (componentType) {
      setDrawerTitle(componentType.label || '')
      if ([PROPS_SETTING_TYPES.addComponentsButton].includes(componentType.type as PROPS_SETTING_TYPES)) {
        setDrawerWidth(542)
      } else if ([PROPS_SETTING_TYPES.mallNav].includes(componentType.type as PROPS_SETTING_TYPES)) {
        setDrawerWidth(800)
      } else {
        setDrawerWidth(720)
      }
      if (componentType.type !== PROPS_SETTING_TYPES.platformAddGoodsItem) {
        setDrawerVisible(true)
      }
    } else {
      setDrawerVisible(false)
    }
  }, [selectedInfo])

  return useMemo(
    () => (
      <Drawer
        maskClosable={false}
        title={drawerTitle}
        placement="right"
        onClose={onClose}
        width={drawerWidth}
        open={drawerVisible}
        className="drawer-box"
      >
        {renderDrawerComponent()}
      </Drawer>
    ),
    [selectedInfo, pageConfig, drawerVisible],
  )
}

export default PropsSettings
