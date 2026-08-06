/**
 * 商城底部导航
 */
import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { RouterKeys } from '@/routes'
import { View } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import useStores from '@/store/useStores'
import { TabBottomItemType } from '@/store/templateStore/model'
import TabBottom from '@/components/TabBottom'
import { useIntl } from '@linkseeks/i18n'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { IS_WEB } from '@/constants'
import { getSupportCustomerServiceConfigGetConfigList } from '@apps/apis'
import homeTab from '@/assets/images/tabs/home.png'
import homeActiveTab from '@/assets/images/tabs/home-active.png'
import categoryTab from '@/assets/images/tabs/category.png'
import categoryActiveTab from '@/assets/images/tabs/category-active.png'
import cartTab from '@/assets/images/tabs/cart.png'
import cartActiveTab from '@/assets/images/tabs/cart-active.png'
import mineTab from '@/assets/images/tabs/mine.png'
import mineActiveTab from '@/assets/images/tabs/mine-active.png'

interface MallTabBottomProps {
  visible?: boolean
  activeUrl: RouterKeys
  layoutType?: LAYOUT_TYPE
  children?: React.ReactNode
}

const getLocalTabIcons = (url: string) => {
  switch (url) {
    case 'extra/mall/b2b':
    case 'extra/mall/client':
    case 'extra/mall/own':
    case 'shop/home':
      return { pic: homeTab, lightPic: homeActiveTab }
    case 'extra/classify':
    case 'extra/commonClassify':
    case 'commodityMerge/stocksSourcing/index':
      return { pic: categoryTab, lightPic: categoryActiveTab }
    case 'order/Purchase':
      return { pic: cartTab, lightPic: cartActiveTab }
    case 'extra/mine':
      return { pic: mineTab, lightPic: mineActiveTab }
    default:
      return undefined
  }
}

const MallTabBottom: React.FC<MallTabBottomProps> = (props) => {
  const { visible, activeUrl, layoutType } = props
  const {
    templateStore: {
      selfBottomConfig,
      shopBottomConfig,
      shopInfo,
      clientMallDesignConfig,
      getSelfMallDesignConfig,
      getClientMallDesignConfig,
      getMallDesignConfig,
    },
    userStore: { shopAndSite, userInfo },
  } = useStores()
  const intl = useIntl()
  const [customerServiceConfig, setCustomerServiceConfig] = useState<Record<string, any> | undefined>({})
  const getHomeUrlByType = (): string => {
    let homeUlr = 'extra/mall/b2b'

    if (shopAndSite?.isSelf) {
      homeUlr = 'extra/mall/own'
    } else {
      switch (shopAndSite?.property) {
        case 1:
          homeUlr = 'extra/mall/b2b'
          break
        case 2:
          homeUlr = 'extra/mall/client'
          break
        default:
          homeUlr = 'extra/mall/b2b'
          break
      }
    }
    return homeUlr
  }

  useEffect(() => {
    // 请求客服配置
    getSupportCustomerServiceConfigGetConfigList().then((res) => {
      if (res?.code === 1000) {
        const qiyuConfig = res?.data?.find((item) => item?.serviceType === 1 && item?.status)
        const imConfig = res?.data?.find((item) => item?.serviceType === 2 && item?.status)

        if (qiyuConfig) {
          setCustomerServiceConfig(qiyuConfig)
        } else if (imConfig) {
          setCustomerServiceConfig(imConfig)
        }
      }
    })
  }, [])
  const fnGetPurchaseName = () => {
    if (shopAndSite?.property === 2 || shopAndSite?.property === 4) {
      return intl.formatMessage({ id: 'cart.2C', defaultMessage: '购物车' })
    }
    return intl.formatMessage({ id: 'mallTabBottom_tabItem_purchase', defaultMessage: '购物车' })
  }
  // 默认底部导航
  const defaultBottomConfig = useMemo(() => {
    console.log(customerServiceConfig, userInfo)
    const mallDefaultList: any[] = [
      {
        url: getHomeUrlByType(),
        lightPic: getOssUrlPath('/Images/home_light.png'),
        pic: getOssUrlPath('/Images/home_default.png'),
        name: intl.formatMessage({ id: 'mallTabBottom_tabItem_home', defaultMessage: '首页' }),
      },
      userInfo &&
        customerServiceConfig?.status &&
        customerServiceConfig?.serviceType === 2 && {
          url: 'im/chatList',
          type: 4,
          lightPic: getOssUrlPath('/Images/order_light.png'),
          pic: getOssUrlPath('/Images/order_default.png'),
          name: intl.formatMessage({ id: 'shop_about_btn_customer_service', defaultMessage: '客服' }),
        },
      userInfo &&
        customerServiceConfig?.status &&
        customerServiceConfig?.serviceType === 1 && {
          url: '/kefu',
          type: 10,
          lightPic: getOssUrlPath('/Images/order_light.png'),
          pic: getOssUrlPath('/Images/order_default.png'),
          name: intl.formatMessage({ id: 'shop_about_btn_customer_service', defaultMessage: '客服' }),
        },
      {
        url: 'order/Purchase',
        lightPic: getOssUrlPath('/Images/order_light.png'),
        pic: getOssUrlPath('/Images/order_default.png'),
        name: fnGetPurchaseName(),
      },
      {
        url: 'extra/mine',
        lightPic: getOssUrlPath('/Images/mine_light.png'),
        pic: getOssUrlPath('/Images/mine_default.png'),
        name: intl.formatMessage({ id: 'mallTabBottom_tabItem_mine', defaultMessage: '我的' }),
      },
    ].filter(Boolean)

    const storeDefaultList: TabBottomItemType[] = [
      {
        url: 'shop/home',
        lightPic: getOssUrlPath('/Images/shophome_light.png'),
        pic: getOssUrlPath('/Images/shophome_default.png'),
        name: intl.formatMessage({ id: 'mallTabBottom_tabItem_home', defaultMessage: '首页' }),
      },
      {
        url: 'commodityMerge/stocksSourcing/index',
        lightPic: getOssUrlPath('/Images/commodity_light.png'),
        pic: getOssUrlPath('/Images/commodity_default.png'),
        name: intl.formatMessage({ id: 'mallTabBottom_tabItem_commodity', defaultMessage: '全部商品' }),
      },
      {
        url: 'members/shop',
        lightPic: getOssUrlPath('/Images/shopmember_light.png'),
        pic: getOssUrlPath('/Images/shopmember_default.png'),
        name: intl.formatMessage({ id: 'mallTabBottom_tabItem_shopMember', defaultMessage: '店铺会员' }),
      },
    ]
    switch (layoutType) {
      case LAYOUT_TYPE.mall:
      case LAYOUT_TYPE.client:
      case LAYOUT_TYPE.own:
        return mallDefaultList
      case LAYOUT_TYPE.shop:
        return storeDefaultList
      default:
        return []
    }
  }, [shopAndSite, customerServiceConfig, userInfo])

  const getBottomConfig = useCallback(() => {
    let bottomConfig: TabBottomItemType[]
    switch (layoutType) {
      case LAYOUT_TYPE.mall:
      case LAYOUT_TYPE.own:
      case LAYOUT_TYPE.client:
        bottomConfig = selfBottomConfig ? selfBottomConfig : defaultBottomConfig
        break
      case LAYOUT_TYPE.shop:
        bottomConfig = shopBottomConfig ? shopBottomConfig : defaultBottomConfig
        break
      default:
        bottomConfig = []
        break
    }

    if (process.env.TARO_ENV !== 'weapp') {
      return bottomConfig
    }

    return bottomConfig.map((item) => {
      const localIcons = getLocalTabIcons(item.url)
      return localIcons ? { ...item, ...localIcons } : item
    })
  }, [shopBottomConfig, selfBottomConfig, customerServiceConfig, userInfo])

  // 兼容 h5 页面强刷装修信息丢失的问题
  useEffect(() => {
    if (
      IS_WEB &&
      [LAYOUT_TYPE.mall, LAYOUT_TYPE.own, LAYOUT_TYPE.client].includes(layoutType as LAYOUT_TYPE) &&
      shopAndSite &&
      !selfBottomConfig
    ) {
      const getDesignConfig = async () => {
        if (shopAndSite?.isSelf) {
          await getSelfMallDesignConfig(shopAndSite.id, shopAndSite.memberId)
        } else {
          if (shopAndSite.property === 2) {
            // C端商城
            if (!clientMallDesignConfig) {
              await getClientMallDesignConfig()
            }
          } else {
            await getMallDesignConfig(shopAndSite.id)
          }
        }
      }
      getDesignConfig()
    }
  }, [])

  const customParam = useMemo(() => {
    switch (layoutType) {
      case LAYOUT_TYPE.own:
        return {
          shopId: shopAndSite?.memberId,
          memberId: shopAndSite?.memberId,
          roleId: shopAndSite?.memberRoleId,
        }
      case LAYOUT_TYPE.shop:
        return {
          id: shopInfo?.id,
          shopId: shopInfo?.id,
          memberId: shopInfo?.memberId,
          roleId: shopInfo?.roleId,
        }
      case LAYOUT_TYPE.mall:
        return {
          spot: true,
        }
      default:
        return {}
    }
  }, [layoutType, shopInfo])

  return visible ? (
    <TabBottom
      style={{ backgroundColor: '#FBF6EF' }}
      param={{
        hasTab: true,
        layoutType,
        ...customParam,
      }}
      tabList={getBottomConfig()}
      activeUrl={activeUrl}
    >
      {props.children}
    </TabBottom>
  ) : (
    <View className="tabBottom">{props.children}</View>
  )
}

MallTabBottom.defaultProps = {
  visible: false,
  layoutType: LAYOUT_TYPE.mall,
}

export default observer(MallTabBottom)
