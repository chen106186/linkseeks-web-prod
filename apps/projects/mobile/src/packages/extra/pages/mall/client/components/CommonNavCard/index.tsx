import React, { useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Image, Text, Toast } from '@apps/mobile-ui'
import Skeleton from '@/components/Skeleton'
import { useIntl } from '@linkseeks/i18n'
import { Swiper, SwiperItem } from '@tarojs/components'
import { arrayGroupsByCount } from '@/utils'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { getMarketingMobileActivityPageGet, getCommodityMobileCategoryMobileCheckCategory } from '@apps/apis'
import styles from './index.module.scss'

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
  status?: boolean
  loading: boolean
  adornId: number | undefined
}

const CommonNavCard: React.FC<CommonNavCardProps> = (props) => {
  const { status, navData, adornId, loading } = props
  const [navList, setNavList] = useState<FunctionItem[][]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const {
    templateStore: { setClientMallId, getClientMallDesignConfig },
  } = useStores()
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
                className={`${styles['swiper-pagination-item']} ${index === currentIndex ? styles['actives'] : ''}`}
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
  const handleLink = (item: FunctionItem) => {
    switch (item.type) {
      case 1:
        setClientMallId(item.id)
        getClientMallDesignConfig(item.id)
        break
      case 2:
        if (item.id) {
          getMarketingMobileActivityPageGet({ id: String(item.id) }, { showError: false })
            .then((res: any) => {
              if (res.code !== 1000) {
                Toast.show({
                  title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }),
                  icon: 'none',
                })
                return
              }
              if (res.code === 1000) {
                Router.navigateTo('activity/index', { id: item.id })
              }
            })
            .catch((err) => console.log(err))
        }
        break
      case 3:
        Router.navigateTo('commodityMerge/stocksSourcing/index', { categoryId: item.id })
        break
      case 4:
        Router.navigateTo('shop/home', { id: item.id })
        break
      case 5:
        if (item.id === 1) {
          Router.navigateTo('shop/findShop')
        }
        if (item.id === 2) {
          Router.navigateTo('shop/popularShop')
        }
        if (item.id === 3) {
          Router.navigateTo('companyNews/newsHome')
        }
        if (item.id === 4) {
          Router.navigateTo('extra/integralMall', {
            title: intl.formatMessage({ id: 'mall_client_commonNavCard_toTitle' }),
            hasBack: true,
          })
        }
        if (item.id === 5) {
          Router.navigateTo('communityGroupBuy/list')
        }
        break
      case 6:
        preload({
          url: item.url,
          title: item.name,
        })
        Router.navigateTo('extra/webview', { webUrl: item.url })
        break
      default:
        break
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
