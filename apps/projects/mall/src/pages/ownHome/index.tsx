import React, { Fragment, useMemo } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import SideNav from '@/components/SideNav'
import { useLoaderData } from 'react-router-dom'
import { OwnHomeLoaderReturn } from '@/loaders/ownHomeLoader'
import HelmetProvider from '@/context/helmetProvider'
import {
  OwnBanner,
  AdvertItem,
  Information,
  CarouselBanner,
  HorizontalBanner,
  Empty,
  RichText,
  HotspotImage,
  CommodityFloor,
  Coupon,
  HorizontalCommodity,
  VerticalCommodity,
  WEB_DESIGN_COMPONENT,
} from '@apps/design-ui'
import { LAYOUT_TYPE } from '@/types/global'
import useHomeDate from './hooks'
import useCoupon from './hooks/useCoupon'
import styles from './index.module.less'

const OwnHome: React.FC = () => {
  const { mallInfo, layoutType, designConfig } = useGlobalConext()
  const { ownInfo } = useLoaderData() as OwnHomeLoaderReturn
  const { newsList } = useHomeDate()
  const { couponList, onReceiveCoupon } = useCoupon()

  const getAdvertByType = (type: 1 | 2 | 3): AdvertItem[] => {
    if (designConfig && Object.keys(designConfig).length > 0) {
      const bannerConfig = designConfig[`OwnBanner-${type}`]
      if (bannerConfig && bannerConfig.advertList && bannerConfig.advertList.length > 0) {
        return bannerConfig.advertList
      }
    }

    return []
  }

  const sortDesignComponentList = useMemo(() => {
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
        return sortDesignComponentList
      }
    }
    return []
  }, [designConfig])

  const getReloadParam = (componentItem) => {
    const ids = (componentItem?.props?.commodityList || []).map((item) =>
      componentItem?.props?.showType === 'marketing' ? item.skuId : item.commodityId,
    )
    return {
      shopId: mallInfo?.id,
      idInList: ids,
      current: '1',
      pageSize: '100',
      memberId: mallInfo?.memberId,
      memberRoleId: mallInfo?.memberRoleId,
    }
  }

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
          <CommodityFloor
            {...componentItem.props}
            linkdisable={false}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      case WEB_DESIGN_COMPONENT.Coupon:
        return (
          <Coupon {...componentItem.props} couponList={couponList} linkdisable={false} onItemClick={onReceiveCoupon} />
        )
      case WEB_DESIGN_COMPONENT.HorizontalCommodity:
        return (
          <HorizontalCommodity
            {...componentItem.props}
            linkdisable={false}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      case WEB_DESIGN_COMPONENT.VerticalCommodity:
        return (
          <VerticalCommodity
            {...componentItem.props}
            linkdisable={false}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      default:
        return undefined
    }
  }

  return (
    <HelmetProvider
      title={ownInfo?.homePage?.title || mallInfo?.name || ''}
      keyword={ownInfo?.homePage?.keywords || mallInfo?.name || ''}
      description={ownInfo?.homePage?.description || mallInfo?.name || ''}
    >
      <div className={styles.container}>
        <div className={styles.horizontalWrap}>
          <OwnBanner type={1} timeLimit advertList={getAdvertByType(1)} />
          <div className={styles.verticalWrap}>
            <OwnBanner type={2} timeLimit advertList={getAdvertByType(2)} />
            <OwnBanner type={3} timeLimit advertList={getAdvertByType(3)} />
          </div>
        </div>
        {sortDesignComponentList.map((componentItem, componentIndex) => (
          <Fragment key={`${componentItem.componentName}-${componentIndex}`}>
            {renderDesignComponent(componentItem)}
          </Fragment>
        ))}
        <Information
          visibleControl
          visible={designConfig ? designConfig[WEB_DESIGN_COMPONENT.Information]?.visible : false}
          newsList={newsList}
        />
        <SideNav />
      </div>
    </HelmetProvider>
  )
}

export default OwnHome
