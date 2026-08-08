import React, { Fragment, useMemo, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { CpecialPageLoaderReturn } from '@/loaders/cpecialPageLoader'
import {
  CarouselBanner,
  HorizontalBanner,
  Empty,
  RichText,
  HotspotImage,
  CommodityFloor,
  WEB_DESIGN_COMPONENT,
  Coupon,
  HorizontalCommodity,
  VerticalCommodity,
} from '@apps/design-ui'
import HelmetProvider from '@/context/helmetProvider'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import useCpecialPage from './hooks'
import styles from './index.module.less'
import { getProductCommodityGetCommodityStock } from '@apps/apis'

const CpecialPage: React.FC = () => {
  const { layoutType, mallInfo } = useGlobalConext()
  const { designConfig } = useLoaderData() as CpecialPageLoaderReturn
  const translate = getWebIntl()
  const { couponList, onReceiveCoupon } = useCpecialPage()

  const [sortDesignComponentList, setSortDesignComponentList] = useState([])

  const init = async () => {
    if (designConfig && Object.keys(designConfig).length > 0) {
      if (designConfig && Object.keys(designConfig).length > 0) {
        const designComponentList: {
          componentName: string
          [key: string]: any
        }[] = []
        Object.keys(designConfig).forEach((key) => {
          const componentName = key.split('-')[0] as WEB_DESIGN_COMPONENT
          if (
            ![
              WEB_DESIGN_COMPONENT.OwnMainNav,
              WEB_DESIGN_COMPONENT.OwnBanner,
              WEB_DESIGN_COMPONENT.Information,
            ].includes(componentName)
          ) {
            designComponentList.push({
              componentName,
              sort: designConfig[key].sort,
              props: designConfig[key],
            })
          }
        })
        const sortDesignComponentList = designComponentList.sort((a, b) => (b.sort > a.sort ? -1 : 1))

        let ids = []
        sortDesignComponentList.forEach((_item) => {
          if (_item.props.commodityList && _item.props.commodityList.length > 0) {
            _item.props.commodityList.forEach((item) => {
              ids.push(item.id)
            })
          }
        })
        ids = [...new Set(ids)]

        const res = await getProductCommodityGetCommodityStock({ idList: ids, shopId: mallInfo.id })

        sortDesignComponentList.forEach((_item) => {
          if (_item.props.commodityList && _item.props.commodityList.length > 0) {
            _item.props.commodityList.forEach((item) => {
              const stock = res.data.find((i) => i.commodityId === item.commodityId)
              console.log(stock, 'stock')
              if (stock) {
                item.stockCount = stock.stockCount
                item.minOrder = stock.minOrder
                item.max = stock.max
                item.min = stock.min
                item.tagList = stock.tagList
              }
            })
          }
        })

        setSortDesignComponentList(() => {
          return [...sortDesignComponentList]
        })
      }
    } else {
      setSortDesignComponentList(() => {
        return []
      })
    }
  }

  useEffect(() => {
    init()
  }, [designConfig])

  /** 渲染自定义装修组件 */
  const renderDesignComponent = (componentItem: { [key: string]: any; componentName: string }) => {
    switch (componentItem.componentName) {
      case WEB_DESIGN_COMPONENT.CarouselBanner:
        return <CarouselBanner timeLimit {...componentItem.props} linkdisable={false} />
      case WEB_DESIGN_COMPONENT.HorizontalBanner:
        return <HorizontalBanner timeLimit {...componentItem.props} linkdisable={false} />
      case WEB_DESIGN_COMPONENT.Empty:
        return <Empty {...componentItem.props} />
      case WEB_DESIGN_COMPONENT.RichText:
        return <RichText {...componentItem.props} />
      case WEB_DESIGN_COMPONENT.HotspotImage:
        return <HotspotImage {...componentItem.props} linkdisable={false} />
      case WEB_DESIGN_COMPONENT.CommodityFloor:
        return (
          <CommodityFloor {...componentItem.props} linkdisable={false} isStore={layoutType === LAYOUT_TYPE.joint} />
        )
      case WEB_DESIGN_COMPONENT.Coupon:
        return (
          <Coupon {...componentItem.props} couponList={couponList} linkdisable={false} onItemClick={onReceiveCoupon} />
        )
      case WEB_DESIGN_COMPONENT.HorizontalCommodity:
        return (
          <HorizontalCommodity
            {...componentItem.props}
            isStore={layoutType === LAYOUT_TYPE.joint}
            linkdisable={false}
          />
        )
      case WEB_DESIGN_COMPONENT.VerticalCommodity:
        return (
          <VerticalCommodity {...componentItem.props} isStore={layoutType === LAYOUT_TYPE.joint} linkdisable={false} />
        )
      default:
        return undefined
    }
  }

  return (
    <HelmetProvider title={designConfig!.name ? designConfig!.name : translate('web.resource.marketing.zhuantiye')}>
      <div
        className={styles.container}
        style={
          designConfig
            ? { backgroundColor: designConfig[WEB_DESIGN_COMPONENT.WrapLayout]?.backgroundColor || '#F5F6F7' }
            : {}
        }
      >
        {sortDesignComponentList.map((componentItem, componentIndex) => (
          <Fragment key={`${componentItem.componentName}-${componentIndex}`}>
            {renderDesignComponent(componentItem)}
          </Fragment>
        ))}
      </div>
    </HelmetProvider>
  )
}

export default CpecialPage
