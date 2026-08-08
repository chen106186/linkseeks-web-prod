import React from 'react'
import { View, Image } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import Skeleton from '@/components/Skeleton'
import Router from '@/utils/router'
import { getMarketingMobileActivityPageGet } from '@apps/apis'
import styles from './index.module.scss'

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
  layoutType?: LAYOUT_TYPE
  shopId?: number
  provinceCode?: string
  cityCode?: string
}

const CommonBanner: React.FC<CommonBannerProps> = (props) => {
  const { bannerList, style, shopId, provinceCode, cityCode } = props
  const { jmpProductDetail, jmpSpotDetailByCommodity } = useProductDetailJump()

  const handleLink = async (item: ItemType) => {
    if (item.id) {
      switch (item.type) {
        case 1:
          await jmpSpotDetailByCommodity({ commodityId: item.id, shopId, provinceCode, cityCode })
          break
        case 2:
          getMarketingMobileActivityPageGet({ id: String(item.id) })
            .then((res: any) => {
              if (res.code === 1000) {
                Router.navigateTo('activity/index', { id: item.id })
              }
            })
            .catch((err) => console.log(err))
          break
        case 3:
          jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, { commodityId: item.id })
          break
        case 4:
          Router.navigateTo('shop/home', { id: item.id })
          break
        case 5:
          break
        default:
          break
      }
    }
  }

  return bannerList && bannerList.length > 0 ? (
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
  ) : (
    <View style={{ margin: '0 8px' }}>
      <Skeleton height={120} borderRadius={8} />
    </View>
  )
}

CommonBanner.defaultProps = {
  layoutType: LAYOUT_TYPE.mall,
}

export default CommonBanner
