import React from 'react'
import { Image, View } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import banner from './image/banner.jpg'

// const RedemptionOfPointsDefault = getOssUrlPath('/miniprogram/assets/images/RedemptionOfPoints.jpg')
const RedemptionOfPointsDefault = banner

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
   * 跳转类型：1-商品详情 2-积分详情 3-店铺主页 4-资讯详情 5-不跳转
   */
  type: number
  /**
   * 跳转ID
   */
  id?: number
}

interface BannerPropsType {
  dataList: ItemType[]
}

const Banner = (props: BannerPropsType) => {
  const { dataList } = props
  return dataList ? (
    <View className={styles['banner-wrapper']}>
      <View className={styles['banner-wrapper-container']}>
        <Image className={styles['banner-wrapper-image']} src={RedemptionOfPointsDefault} />
      </View>
    </View>
  ) : null
}

export default Banner
