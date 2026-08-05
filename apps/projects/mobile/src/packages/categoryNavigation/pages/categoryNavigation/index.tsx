import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { Tabs, ScrollView, Toast, ActivityIndicator, Loading, Icons } from '@apps/mobile-ui'
import { LabelProps } from '@/components/Label'
import { observer } from 'mobx-react-lite'
import { ColumnCommodity as Commodity } from '@/components/Commodity/index'
import { LAYOUT_TYPE, SHOP_PROPERTY, SHOP_TYPE } from '@/constants/const/shop'
import classnames from 'classnames'
import useStores from '@/store/useStores'
import { useRouter } from '@apps/mobile-services/utils/taro'
import CommonMallHeader from '@/components/CommonMallHeader'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { THEME_COLORS } from '@/constants/theme'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import NavList, { NavItemType } from './components/navs'
import BrandList, { BrandType } from './components/brands'
import SimpleCommodity from './components/simpleCommodity'
import useGetLayout, { HasRequestTabPaneDataType } from './hooks/useGetLayout'
import MallTabBottom from '@/components/MallTabBottom'
import styles from './index.module.scss'
interface Iprops {
  router: {
    params: {
      /** 模板id */
      id: number
      /** 一级品类id */
      categoryId?: number
    }
  }
}
const CategoryNavigation: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const router = useRouter()
  const { jmpProductDetail } = useProductDetailJump()
  const { id, categoryId } = router?.params || {}
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const isSelfMall = shopAndSite?.isSelf

  /**
   * tabs 指所有标签页，
   * onChange 当tab 页修改时事件
   * activeTabKey 当前激活的TabKey
   * onReached: 到达底部时的事件
   * currentTabOtherprops 为当前激活页的其余属性，
   * tabContentLoading 当前tab 是否是加载中
   *   */
  const {
    tabs,
    onChange,
    tabContentData,
    activeTabKey,
    onReached,
    currentTabOtherProps,
    tabContentLoading,
    pageLoading,
    refresh,
    onRefresh,
  } = useGetLayout(Number(id), {
    /** 设计缺陷， 如果是自营商城，那么有个父级shopid， 这个id 是用来请求装修内容的。。。所以如果是自营商城的话，shopId 跟 selfMallShopId 有点不同 */
    shopId: isSelfMall ? shopAndSite!.id! : shopAndSite!.id,
    categoryId: +categoryId!,
    isSelfMall,
    selfInfo: {
      memberId: shopAndSite?.memberId as number,
      roleId: shopAndSite?.memberRoleId as number,
    },
    /* 自营商城id  */
    selfMallShopId: shopAndSite!.id,
    currentCity: currentCity!,
  })

  /** 根据顺序以及status 即visible 去控制显示 */
  const tabVisibleSortedKey = useMemo(() => {
    if (currentTabOtherProps === null) {
      return ['secondary', 'flashSale', 'saleRanking', 'brand', 'suggestProduct']
    }
    const sorted = Object.keys(currentTabOtherProps)
      .map((_item) => ({
        name: _item,
        sort: currentTabOtherProps[_item].sort,
        visible: currentTabOtherProps[_item].status ?? true,
      }))
      .filter((_item) => _item.visible)
      .sort((a, b) => a.sort - b.sort)
      .map((_item) => _item.name)
    return sorted
  }, [currentTabOtherProps])

  /** 添加首页标签 */
  const withHomeTab = useMemo(() => tabs, [tabs])
  const handleOnTabClick = useCallback(
    (index: number) => {
      const tabId = withHomeTab?.[index].id
      if (tabId === -1) {
        Router.navigateBack()
        return
      }
      onChange(tabId!.toString())
    },
    [onChange, withHomeTab],
  )
  /** 这里scrollView 需要减掉这个头部的高度 */
  const renderHeader = () => {
    return <CommonMallHeader adornId={Number(id!)} isSelf={isSelfMall} isShowCategory={false} />
  }
  const handleJump = () => {
    if (isSelfMall) {
      Router.navigateTo('extra/commonClassify')
    }
    Router.navigateTo('extra/classify')
  }
  const renderTabs = useMemo(() => {
    const tabList = withHomeTab?.map((_item) => ({
      title: _item.name,
    }))
    const current = withHomeTab?.findIndex((_item) => _item.id === Number(activeTabKey))
    return (
      <View className={styles['category-tab-container']}>
        {/* h5 下concat TabList 会导致首页这个选项莫名跳到了最后面，所以曲线救国 */}
        <View className={styles['category-tab-home']} onClick={() => Router.navigateBack()}>
          <Text>
            {intl.formatMessage({
              id: 'categoryNavigation.home',
              defaultMessage: '首页',
            })}
          </Text>
        </View>
        <Tabs scroll tabList={tabList} current={current} onClick={handleOnTabClick} />
        <View className={styles['category-tab-more']} onClick={handleJump}>
          <Icons name="Menu" size={26} color={THEME_COLORS.textSecondary} />
        </View>
      </View>
    )
  }, [withHomeTab, handleOnTabClick, activeTabKey])
  const handleNavClick = (navProps: NavItemType) => {
    if (!isSelfMall) {
      Router.navigateTo('commodityMerge/stocksSourcing/index', {
        categoryId: navProps.id,
        categoryName: navProps.name,
        type: 1,
      })
      return
    }
    Router.navigateTo('commodityMerge/stocksSourcing/index', {
      categoryId: navProps.id,
      categoryName: navProps.name,
    })
  }
  const renderNav = (data: NavItemType[]) => (
    <View className={styles['navCard']}>
      <NavList dataSource={data} onClick={handleNavClick} />
    </View>
  )
  const handleBrandClick = (brandProps: BrandType) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', {
      brandId: brandProps.id,
      brandName: brandProps.name,
      categoryId: activeTabKey,
    })
  }
  const renderBrand = (data: BrandType[]) => {
    return (
      <View className={styles['brandCard']}>
        <BrandList dataSource={data} onClick={handleBrandClick} />
      </View>
    )
  }
  const handlePressCommodity = (dataProps: { id: number }) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
      commodityId: dataProps.id,
    })
  }
  const renderSimpleCommodity = (dataSource, title) => (
    <View className={styles['flashSale']}>
      <View className={styles['card-header']}>{title}</View>
      <View className={styles['card-body']}>
        <SimpleCommodity dataSource={dataSource} onClick={handlePressCommodity} />
      </View>
    </View>
  )
  const renderFlashSale = (data: HasRequestTabPaneDataType['content']['flashSale']) => {
    const flashSaleDataSource = data?.map((_item) => {
      return {
        name: _item.productName,
        price: _item.price,
        discount: _item.activityPrice,
        pic: _item.productImgUrl,
        id: _item.productId,
      }
    })
    return renderSimpleCommodity(flashSaleDataSource, currentTabOtherProps?.flashSale?.title || '')
  }
  const renderSaleRanking = (data: HasRequestTabPaneDataType['content']['saleRanking']) => {
    const saleRankingData = data.map((_item) => {
      return {
        name: _item.name,
        pic: _item.mainPic,
        id: _item.id,
        sale: _item.sale,
        discount: _item.min,
      }
    })
    return renderSimpleCommodity(saleRankingData, currentTabOtherProps?.saleRanking?.title || '')
  }
  const renderCommodity = (data: HasRequestTabPaneDataType['content']['suggestProduct']) => {
    const dataSource = data.map((_item) => ({
      productName: _item.name,
      productImg: _item.mainPic,
      discount: _item.price,
      productId: _item.id,
      tags: _item.label?.map((_row) => ({
        name: _row,
        type: 'danger',
      })) as LabelProps[],
      sale: _item.sold,
    }))
    return (
      <View className={styles['commodityList']}>
        <Commodity dataSource={dataSource} />
      </View>
    )
  }
  const renderFooter = () => {
    if (tabContentData?.suggestProductNoMore) {
      return (
        <View className={styles['scrollViewFooter']}>
          <Text>
            {intl.formatMessage({
              id: 'categoryNavigation.isBottom',
              defaultMessage: '已经到底啦~',
            })}
          </Text>
        </View>
      )
    }
    if (pageLoading) {
      return (
        <View className={styles['scrollViewFooter']}>
          <Text>
            {intl.formatMessage({
              id: 'categoryNavigation.loading',
              defaultMessage: '正在加载~',
            })}
          </Text>
        </View>
      )
    }
    return null
  }
  const handleReach = () => {
    onReached()
  }
  const handleRefresh = () => {
    onRefresh()
  }
  const fn = {
    brand: renderBrand,
    secondary: renderNav,
    flashSale: renderFlashSale,
    saleRanking: renderSaleRanking,
    suggestProduct: renderCommodity,
  }
  const renderScrollContent = () => {
    if (tabContentLoading) {
      return (
        <View className={classnames(styles['indicatorContainer'], styles['scrollViewContent'])}>
          <ActivityIndicator className={styles['indicator']} size={20} isOpened />
          <Text className={styles['indicatorText']}>
            {intl.formatMessage({
              id: 'categoryNavigation.loading',
              defaultMessage: '正在加载~',
            })}
          </Text>
        </View>
      )
    }
    return (
      <ScrollView
        style={{
          backgroundColor: THEME_COLORS.page,
          display: 'flex',
          flexDirection: 'column',
        }}
        className={styles['scrollViewContent']}
        onEndReachedThreshold={50}
        refresherEnabled
        refresherTriggered={refresh}
        onEndReached={handleReach}
        onRefresherRefresh={handleRefresh}
        listFooterComponent={renderFooter}
      >
        <View className={styles['innerScroll']}>
          {tabVisibleSortedKey.map((_item) => {
            return <View key={`${_item}-${activeTabKey}`}>{fn[_item]?.(tabContentData?.[_item] || []) || null}</View>
          })}
        </View>
      </ScrollView>
    )
  }
  return (
    <MallTabBottom layoutType={LAYOUT_TYPE.mall} visible activeUrl="extra/mall/b2b">
      <View className={styles['categoryPage']}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderHeader()}
          {renderTabs}
        </View>
        <View
          style={{
            display: 'flex',
            overflow: 'scroll',
            flex: 1,
          }}
        >
          {renderScrollContent()}
        </View>
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(observer(CategoryNavigation))
