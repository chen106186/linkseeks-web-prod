import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { GlobalState } from '@/context/globalProvider'
import { LAYOUT_TYPE, LoaderDataType, NavItemType } from '@/types/global'
import { authService, mallService, positionService } from '@apps/services'
import { localesStorage } from '@linkseeks/storage'
import { getJointDefaultMenu, getOwnDefaultMenu, getStoreDefaultMenu } from './utils/menu'
import { getAllWebShopList, getDesignConfig } from './utils/init'
import { commonPrefix, secondaryDir } from '../../config/routes.config'

const useInitData = () => {
  const {
    params,
    href,
    pathname,
    mallInfo,
    mallList,
    layoutType,
    mallUrl,
    designConfig,
    footerDesignConfig,
    shopInfo,
    userInfo,
  } = useLoaderData() as LoaderDataType

  /**
   * 获取商城导航
   */
  const getNavList = (): NavItemType[] => {
    try {
      if (layoutType === LAYOUT_TYPE.own) {
        // 判断是否有导航装修数据
        const NAV_KEY = 'OwnMainNav'
        if (
          designConfig &&
          Object.keys(designConfig).length > 0 &&
          Object.keys(designConfig).some((key) => key === NAV_KEY)
        ) {
          return designConfig[NAV_KEY].menuData || []
        } else {
          return getOwnDefaultMenu()
        }
      } else if (layoutType === LAYOUT_TYPE.joint) {
        const NAV_KEY = 'MallMainNav'
        if (
          designConfig &&
          Object.keys(designConfig).length > 0 &&
          Object.keys(designConfig).some((key) => key === NAV_KEY)
        ) {
          return designConfig[NAV_KEY].menuData || []
        } else {
          return getJointDefaultMenu()
        }
      } else if (layoutType === LAYOUT_TYPE.shop) {
        const NAV_KEY = 'MainNav'
        if (
          designConfig &&
          Object.keys(designConfig).length > 0 &&
          Object.keys(designConfig).some((key) => key === NAV_KEY)
        ) {
          return designConfig[NAV_KEY].menuData || []
        } else {
          return getStoreDefaultMenu()
        }
      }
      return []
    } catch (error) {
      return []
    }
  }

  const prefix = `${secondaryDir ? secondaryDir : ''}${params?.subDomain ? `/${params?.subDomain}` : ''}`

  const [globalState, setGlobalState] = useState<GlobalState>({
    mallInfo,
    mallList,
    navList: getNavList(),
    designConfig,
    footerDesignConfig,
    shopInfo,
    layoutType,
    userInfo: userInfo || authService.getAuth(),
    isMro: mallInfo?.isOpenMro || false,
    currentCity: positionService.getPosition(),
    pathname,
    url: href,
    locale: localesStorage.getItem() || 'zh-CN',
    mallUrl,
    urlPrefix: layoutType === LAYOUT_TYPE.own ? `${prefix}/${mallInfo?.memberId}` : `${prefix}`,
  })
  const [loading, setLoading] = useState<boolean>(true)

  const initGlobalState = async () => {
    try {
      // 生产环境客户端调用获取商城接口
      if (!import.meta.env.DEV) {
        getAllWebShopList()
        if (mallInfo?.adornId) {
          getDesignConfig(mallInfo.adornId)
        }
      }
      let currentCity = positionService.getPosition()
      if (!currentCity) {
        currentCity = await positionService.initPosition()
      }

      setGlobalState({
        ...globalState,
        currentCity,
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initGlobalState()
    if (mallInfo && mallInfo.type === 1) {
      mallService.setMall(mallInfo)
    }
  }, [])

  return {
    loading,
    layoutType,
    globalState,
  }
}

export default useInitData
