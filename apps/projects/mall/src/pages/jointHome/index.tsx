import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import Category from '@/components/Category'
import SideNav from '@/components/SideNav'
import { getCommodityWebCategoryWebFindEnterpriseCategoryTree, getProductCommodityGetCommodityStock } from '@apps/apis'
import { CategoryItemType } from '@/types/commodity'
import { initCategoryData } from '@/utils/category'
import { LAYOUT_TYPE } from '@/types/global'
import { useLoaderData } from 'react-router-dom'
import { JointHomeLoaderReturn } from '@/loaders/jointHomeLoader'
import HelmetProvider from '@/context/helmetProvider'
import QuickNav from './components/QuickNav'
import {
  Advert,
  AdvertItem,
  CarouselBanner,
  CommodityFloor,
  Empty,
  HorizontalBanner,
  HotspotImage,
  Information,
  FindMore,
  RichText,
  Coupon,
  HorizontalCommodity,
  VerticalCommodity,
  WEB_DESIGN_COMPONENT,
  CommodityStoreFloor,
} from '@apps/design-ui'
import useCoupon from '../ownHome/hooks/useCoupon'
import useHomeDate from './hooks'
import styles from './index.module.less'

const JointHome: React.FC = () => {
  const { userInfo, mallInfo, designConfig, layoutType, pathname } = useGlobalConext()
  const { seoInfo } = useLoaderData() as JointHomeLoaderReturn
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([])
  const { newsList, inquiryList, tradeList } = useHomeDate(
    designConfig ? designConfig[WEB_DESIGN_COMPONENT.FindMore]?.visible : false,
  )
  const { couponList, onReceiveCoupon } = useCoupon()

  /**
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    const param: any = {
      adornId: mallInfo?.adornId,
    }

    const headers: any = {
      shopId: mallInfo?.id,
    }

    getCommodityWebCategoryWebFindEnterpriseCategoryTree(param, { headers }).then((res) => {
      if (res.code === 1000 && res.data) {
        setCategoryList(initCategoryData(res.data))
      }
    })
  }

  useEffect(() => {
    if (mallInfo && mallInfo?.adornId) {
      getCategoryTree()
    }
  }, [mallInfo])

  const getAdvertByType = (type: string): AdvertItem[] => {
    if (designConfig && Object.keys(designConfig).length > 0) {
      const bannerConfig = designConfig[`${WEB_DESIGN_COMPONENT.Advert}-${type}`]
      if (bannerConfig && bannerConfig.advertList && bannerConfig.advertList.length > 0) {
        return bannerConfig.advertList
      }
    }

    return []
  }

  const [sortDesignComponentList, setSortDesignComponentList] = useState<
    {
      componentName: string
      [key: string]: any
    }[]
  >([])

  const initDesignComponents = async () => {
    if (designConfig && Object.keys(designConfig).length > 0) {
      const designComponentList: {
        componentName: string
        [key: string]: any
      }[] = []
      Object.keys(designConfig).forEach((key) => {
        const componentName = key.split('-')[0] as WEB_DESIGN_COMPONENT
        if (
          ![WEB_DESIGN_COMPONENT.OwnMainNav, WEB_DESIGN_COMPONENT.OwnBanner, WEB_DESIGN_COMPONENT.Information].includes(
            componentName,
          )
        ) {
          designComponentList.push({
            componentName,
            sort: designConfig[key].sort,
            props: designConfig[key],
          })
        }
      })
      const sortDesignComponentList = designComponentList.sort((a, b) => (b.sort > a.sort ? -1 : 1))

      // 收集所有商品ID
      let ids: any[] = []
      sortDesignComponentList.forEach((_item) => {
        if (_item.props.commodityList && _item.props.commodityList.length > 0) {
          _item.props.commodityList.forEach((item: any) => {
            ids.push(item.id)
          })
        }
      })
      ids = [...new Set(ids)]

      // 获取库存数据
      if (ids.length > 0 && mallInfo?.id) {
        const res = await getProductCommodityGetCommodityStock({ idList: ids, shopId: mallInfo.id })

        sortDesignComponentList.forEach((_item) => {
          if (_item.props.commodityList && _item.props.commodityList.length > 0) {
            _item.props.commodityList.forEach((item: any) => {
              const stock = res.data.find((i: any) => i.commodityId === item.commodityId)
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
      }

      setSortDesignComponentList([...sortDesignComponentList])
    } else {
      setSortDesignComponentList([])
    }
  }

  useEffect(() => {
    initDesignComponents()
  }, [designConfig, mallInfo])

  const getReloadParam = (componentItem) => {
    const ids = (componentItem?.props?.commodityList || []).map((item) =>
      componentItem?.props?.showType === 'marketing' ? item.skuId : item.commodityId,
    )
    return {
      shopId: mallInfo?.id,
      idInList: ids,
      current: '1',
      pageSize: '100',
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
            isStore
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      case WEB_DESIGN_COMPONENT.CommodityStoreFloor:
        return (
          <CommodityStoreFloor
            {...componentItem.props}
            linkdisable={false}
            isStore
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
            isStore={layoutType === LAYOUT_TYPE.joint}
            linkdisable={false}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      case WEB_DESIGN_COMPONENT.VerticalCommodity:
        return (
          <VerticalCommodity
            {...componentItem.props}
            isStore={layoutType === LAYOUT_TYPE.joint}
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
      title={seoInfo?.title || mallInfo?.name || ''}
      keyword={seoInfo?.keywords || mallInfo?.name || ''}
      description={seoInfo?.description || mallInfo?.name || ''}
    >
      <div className={styles.container}>
        <div className={styles.horizontalWrap}>
          <Category categoryList={categoryList} type={LAYOUT_TYPE.joint} />
          <div className={styles.bannerWrap}>
            <Advert timeLimit type="banner" advertList={getAdvertByType('banner')} />
            <Advert timeLimit type="interact" advertList={getAdvertByType('interact')} />
          </div>
          <div className={styles.quickNavWrap}>
            <QuickNav
              userInfo={userInfo}
              name={mallInfo?.name}
              advertList={getAdvertByType('nav')}
              locationPath={pathname}
            />
          </div>
        </div>
        {sortDesignComponentList.map((componentItem, componentIndex) => (
          <Fragment key={`${componentItem.componentName}-${componentIndex}`}>
            {renderDesignComponent(componentItem)}
          </Fragment>
        ))}
        <FindMore
          visibleControl
          visible={designConfig ? designConfig[WEB_DESIGN_COMPONENT.FindMore]?.visible : false}
          inquiryList={inquiryList}
          tradeList={tradeList}
        />
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

export default JointHome
