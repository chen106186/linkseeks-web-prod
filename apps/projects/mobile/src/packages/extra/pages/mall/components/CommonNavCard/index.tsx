import React, { useEffect, useMemo, useState, useRef } from 'react'
import cx from 'classnames'
import { showLoading, hideLoading, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Image, Text } from '@apps/mobile-ui'
import Skeleton from '@/components/Skeleton'
import { RouterKeys } from '@/routes'
import { Swiper, SwiperItem } from '@tarojs/components'
import { arrayGroupsByCount } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { ShopInfoType } from '@/store/userStore/model'
import useStores from '@/store/useStores'
import {
  getMarketingMobileActivityPageGet,
  getCommodityMobileCategoryMobileCheckCategory,
  getCommodityShopDetails,
} from '@apps/apis'
import styles from './index.module.scss'

export interface LinkTypeProps {
  [key: number]:
    | RouterKeys
    | {
        [key: number]: RouterKeys
      }
}

type FunctionItem = {
  id: number
  /** 名称 */
  name: string
  type: number
  /** 链接 */
  url: string
  /** 图标 */
  icon: string
}

interface CommonNavCardProps {
  navData?: FunctionItem[]
  linkType: LinkTypeProps
  status?: boolean
  loading: boolean
  adornId: number | undefined
}

const CommonNavCard: React.FC<CommonNavCardProps> = (props) => {
  const { status, navData, linkType, adornId, loading } = props
  const [navList, setNavList] = useState<FunctionItem[][]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const {
    userStore: { shopAndSite, setShopAndSite },
    templateStore: { getSelfMallDesignConfig },
  } = useStores()
  const clickState = useRef<boolean>(true)
  const intl = useIntl()

  useEffect(() => {
    if (navData && Array.isArray(navData) && navData.length > 0) {
      setNavList(arrayGroupsByCount(navData, 10))
    }
  }, [navData])

  const getContainerHeight = (length: number) => {
    if (length > 10) {
      return styles['l']
    }
    if (length > 5) {
      return styles['mm']
    }
    return styles['ss']
  }

  const _renderPagination = useMemo(() => {
    const paginationData: any = []
    for (let i = 0; i < navList.length; i += 1) {
      paginationData.push(`paginationKey${i}`)
    }
    if (paginationData.length > 1) {
      return (
        <View className={styles['swiper-pagination']}>
          <View className={styles['swiper-pagination-wrap']}>
            {paginationData.map((item, index) => (
              <View
                key={item}
                className={cx(styles['swiper-pagination-item'], index === currentIndex ? styles['actives'] : '')}
              />
            ))}
          </View>
        </View>
      )
    }
    return null
  }, [navList, currentIndex])

  const handleChange = (values: any) => {
    setCurrentIndex(values.detail.current)
  }

  const getUrlByLinkType = (info: FunctionItem): RouterKeys | undefined => {
    const temp = linkType[info.type]
    if (typeof temp === 'object') {
      if (info.id) {
        return temp[info.id]
      }
    } else if (typeof temp === 'string') {
      return temp
    }
    return undefined
  }

  const jumpOtherMall = async (shopId: number) => {
    showLoading({
      title: intl.formatMessage({ id: 'mall_common_loading' }),
      mask: true,
    })
    const res = await getCommodityShopDetails({ id: `${shopId}` })
    if (res.code === 1000 && res.data) {
      const { data } = res
      if (data && shopAndSite) {
        const newInfo: any = {
          ...data,
          memberId: shopAndSite?.memberId,
          memberRoleId: shopAndSite.memberRoleId,
        }
        const shopAndSiteInfo: ShopInfoType = {
          ...newInfo,
          id: data.id,
          shopId: data.id,
          name: data.name,
          shopName: data.name,
          shopLogo: data.logoUrl,
          isMemberOperate: data.isMemberOperate,
          isSelf: true,
          property: data.property,
          shopType: 1,
        }
        await getSelfMallDesignConfig(data.id, shopAndSite.memberId)
        setShopAndSite(shopAndSiteInfo)
        hideLoading()
        Router.reLaunch('extra/mall/own')
      }
    } else {
      hideLoading()
    }
  }

  const handleLink = (info: FunctionItem) => {
    if (!clickState.current) return
    const url: any = getUrlByLinkType(info)
    if (url) {
      const param: any = {}
      // 自营商城商城导航跳转
      if (url === 'own') {
        info.id && jumpOtherMall(info.id)
        return
      }

      // 自营商城商城导航跳转
      if (url === 'enterprise') {
        // info.id && jumpOtherMall(info.id)
        return
      }

      if (url === 'category') {
        if (!info.id) return
        Router.navigateTo('commodityMerge/stocksSourcing/index', { categoryId: info.id })
        return
      }

      if (url === 'activity/index') {
        if (!info.id) return
        clickState.current = false
        getMarketingMobileActivityPageGet({ id: String(info.id) })
          .then((res: any) => {
            if (res.code === 1000) {
              Router.navigateTo('activity/index', { id: info.id })
              clickState.current = true
            }
            clickState.current = true
          })
          .catch(() => (clickState.current = true))
        return
      }

      switch (url) {
        case 'extra/categoryNavigation':
          param.adornId = adornId
          param.categoryId = info.id
          break
        // 活动主页
        case 'activity/index':
          param.id = info.id
          break
        case 'members/my':
          param.upperMemberId = shopAndSite?.memberId
          param.upperRoleId = shopAndSite?.memberRoleId
          break
        case 'shop/pointExchange':
          param.memberId = shopAndSite?.memberId
          param.roleId = shopAndSite?.memberRoleId
          param.shopId = shopAndSite?.memberId
          break
        // 店铺首页跳转
        case 'shop/home':
          param.id = info.id
          break
        // 外部链接跳转
        case 'extra/webview':
          if (!info.url) return
          preload({
            url: info.url,
            title: info.name,
          })
          // 直接传参，避免 preloadData 在部分小程序场景下丢失导致白屏
          param.webUrl = info.url
          break
        default:
          break
      }
      Router.navigateTo(url, { ...param })
    }
  }

  return !loading ? (
    navData && navList.length > 0 && status ? (
      <View className={cx(styles['common-nav-card'], getContainerHeight(navData.length))}>
        <Swiper onChange={handleChange} className={getContainerHeight(navData.length)}>
          {navList.map((listItem: FunctionItem[], listIndex: number) => (
            <SwiperItem className={styles['navList']} key={`navList_${listIndex}`}>
              {listItem.map((item, index) => (
                <View
                  className={styles['navItem']}
                  key={`navItem_${item.name}_${index}`}
                  onClick={() => handleLink(item)}
                >
                  <Image className={styles['navIcon']} src={item.icon} />
                  <Text className={styles['navText']}>{item.name}</Text>
                </View>
              ))}
            </SwiperItem>
          ))}
        </Swiper>
        {_renderPagination}
      </View>
    ) : null
  ) : (
    <View style={{ margin: pxTransform(8) }}>
      <Skeleton height={172} borderRadius={8} />
    </View>
  )
}

CommonNavCard.defaultProps = {
  status: true,
}

export default CommonNavCard
