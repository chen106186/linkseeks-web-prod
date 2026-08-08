import React, { useState, useEffect } from 'react'
import { Drawer } from 'antd'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import AdvertSetting from './components/AdvertSetting'
import { SelectedInfoType, clearSelectedStatus, PROPS_SETTING_TYPES } from '@apps/design-core'
import MallNav from './components/MallNav'
import AddComponents from './components/AddComponents'
import CarouselBanner from './components/CarouselBanner'
import HorizontalBanner from './components/HorizontalBanner'
import VisibleSwitch from './components/VisibleSwitch'
import Empty from './components/Empty'
import RichText from './components/RichText'
import CommodityFloor from './components/CommodityFloor'
import HotspotImage from './components/HotspotImage'
import Coupon from './components/Coupon'
import CommodityRecommend from './components/CommodityRecommend'
import Footer from './components/Footer'
import './index.less'

interface PropsSettingsPropsType {
  selectedInfo?: SelectedInfoType
  adornId: number
  type: 'shop' | 'own'
  shopId: number
  layoutType: LAYOUT_TYPE
}

const PropsSettings: React.FC<PropsSettingsPropsType> = (props) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [drawerTitle, setDrawerTitle] = useState<string>('')
  const [drawerWidth, setDrawerWidth] = useState<number>(800)
  const { selectedInfo, layoutType } = props

  const onClose = () => {
    setDrawerVisible(false)
    clearSelectedStatus()
  }

  const renderDrawerComponent = () => {
    const { props: initProps, propsConfig } = selectedInfo || {}
    const componentType = propsConfig?.componentType

    const mergeProps = {
      ...initProps,
      layoutType,
    }

    if (componentType) {
      switch (componentType.type) {
        case PROPS_SETTING_TYPES.mallNav:
          return <MallNav {...mergeProps} />
        case PROPS_SETTING_TYPES.advert:
          return <AdvertSetting {...mergeProps} />
        case PROPS_SETTING_TYPES.addComponentsButton:
          return <AddComponents {...mergeProps} />
        case PROPS_SETTING_TYPES.carouselBanner:
          return <CarouselBanner {...mergeProps} />
        case PROPS_SETTING_TYPES.horizontalBanner:
          return <HorizontalBanner {...mergeProps} />
        case PROPS_SETTING_TYPES.information:
          return <VisibleSwitch {...mergeProps} />
        case PROPS_SETTING_TYPES.empty:
          return <Empty {...mergeProps} />
        case PROPS_SETTING_TYPES.richText:
          return <RichText {...mergeProps} />
        case PROPS_SETTING_TYPES.commodityFloor:
          return <CommodityFloor {...mergeProps} />
        case PROPS_SETTING_TYPES.hotspotImage:
          return <HotspotImage {...mergeProps} />
        case PROPS_SETTING_TYPES.coupon:
          return <Coupon {...mergeProps} />
        case PROPS_SETTING_TYPES.horizontalCommodity:
        case PROPS_SETTING_TYPES.verticalCommodity:
          return <CommodityRecommend {...mergeProps} />
        case PROPS_SETTING_TYPES.mallFooter:
          return <Footer {...mergeProps} />
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
      setDrawerVisible(true)
    } else {
      setDrawerVisible(false)
    }
  }, [selectedInfo])

  return (
    <Drawer
      maskClosable={false}
      title={drawerTitle}
      placement="right"
      onClose={onClose}
      width={drawerWidth}
      open={drawerVisible}
    >
      {renderDrawerComponent()}
    </Drawer>
  )
}

export default PropsSettings
