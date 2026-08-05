import React, { useRef } from 'react'
import { View, Image } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import { RouterKeys } from '@/routes'
import Skeleton from '@/components/Skeleton'
import Router from '@/utils/router'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { getMarketingMobileActivityPageGet } from '@apps/apis'
import styles from './index.module.scss'

export interface LinkTypeProps {
  [key: number]: RouterKeys
}

type ItemType = {
  /**
   * 名称
   */
  name: string
  /**
   * 图片
   */
  img: string
  /**
   * 跳转类型：
   */
  type: number
  /**
   * 跳转ID
   */
  id: number
}

interface CommonBannerProps {
  style?: React.CSSProperties
  bannerList: ItemType[]
  linkType: LinkTypeProps
  loading: boolean
  shopId?: number
  provinceCode?: string
  cityCode?: string
}

const Banner: React.FC<CommonBannerProps> = (props) => {
  const { bannerList, linkType, loading, style, shopId, provinceCode, cityCode } = props
  const clickState = useRef<boolean>(true)
  const { jmpProductDetailByUrl, jmpSpotDetailByCommodity } = useProductDetailJump()

  const handleLink = async (info: ItemType) => {
    if (!clickState.current) return
    const url: RouterKeys = linkType[info.type]
    let jump = true
    if (url) {
      const param: any = {}
      switch (url) {
        case 'companyNews/newsInformation':
          if (!info.id) jump = false
          param.informationId = info.id
          break
        case 'shop/home':
          if (!info.id) jump = false
          param.id = info.id
          break
        case 'commodityMerge/stocksSourcing/detail':
          if (!info.id) return
          param.commodityId = info.id
          await jmpSpotDetailByCommodity({ ...param, shopId, provinceCode, cityCode })
          return
        case 'commodityMerge/pointsSourcing/detail':
          if (!info.id) return
          param.commodityId = info.id
          jmpProductDetailByUrl(url, { ...param })
          return
        default:
          break
      }

      if (url === 'activity/index') {
        if (!info.id) return
        clickState.current = false
        getMarketingMobileActivityPageGet({ id: String(info.id) })
          .then((res: any) => {
            if (res.code === 1000) {
              Router.navigateTo('activity/index', { id: info.id })
            }
            clickState.current = true
          })
          .catch(() => (clickState.current = true))
        return
      }
      if (jump) Router.navigateTo(url, { ...param })
    }
  }

  return !loading ? (
    bannerList && bannerList.length > 0 ? (
      <View className={styles['common-banner']} style={style}>
        <Swiper className={styles['swiper-list']} circular autoplay>
          {bannerList.map((item, index) => (
            <SwiperItem key={`${item.id}_${index}`}>
              <View className={styles['swiper-list-item']} onClick={() => handleLink(item)}>
                <Image mode="widthFix" className={styles['swiper-list-item-img']} src={item.img} />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    ) : null
  ) : (
    <View style={{ margin: '8px' }}>
      <Skeleton height={60} borderRadius={8} />
    </View>
  )
}

export default Banner
