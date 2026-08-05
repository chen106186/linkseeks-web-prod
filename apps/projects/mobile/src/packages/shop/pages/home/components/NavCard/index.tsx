import React, { useEffect, useMemo, useState, useRef } from 'react'
import cx from 'classnames'
import { preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Image, Text } from '@apps/mobile-ui'
import Skeleton from '@/components/Skeleton'
import { RouterKeys } from '@/routes'
import { Swiper, SwiperItem } from '@tarojs/components'
import { arrayGroupsByCount } from '@/utils'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { getMarketingMobileActivityPageGet } from '@apps/apis'
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

interface NavCardProps {
  navData?: FunctionItem[]
  linkType: LinkTypeProps
  status?: boolean
  loading: boolean
  adornId: number | undefined
}

const NavCard: React.FC<NavCardProps> = (props) => {
  const { status, navData, linkType, loading } = props
  const [navList, setNavList] = useState<FunctionItem[][]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const {
    templateStore: { shopInfo },
  } = useStores()
  const clickState = useRef<boolean>(true)

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

  const handleLink = (info: FunctionItem) => {
    if (!clickState.current) return
    const url: any = getUrlByLinkType(info)
    if (url) {
      const param: any = {}
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
        case 'commodityMerge/stocksSourcing/index':
          param.categoryId = info.id
          param.id = shopInfo?.id
          break
        // 活动主页
        case 'activity/index':
          param.id = info.id
          break
        case 'shop/pointExchange':
          param.memberId = shopInfo?.memberId
          param.roleId = shopInfo?.roleId
          param.shopId = shopInfo?.id
          break
        case 'members/shop':
          param.memberId = shopInfo?.memberId
          param.roleId = shopInfo?.roleId
          break
        // 外部链接跳转
        case 'extra/webview':
          preload({
            url: info.url,
            title: info.name,
          })
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

NavCard.defaultProps = {
  status: true,
}

export default NavCard
