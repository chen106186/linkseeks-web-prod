import React, { useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import cx from 'classnames'
import ImageBox from '@/components/ImageBox'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import { arrayGroupsByCount } from '@/utils'
import { Swiper, SwiperItem } from '@tarojs/components'
import { getProductMobileShopScoreGetCategoryTree } from '@apps/apis'
import styles from './index.module.scss'

export interface CategoryItemType {
  name: string
  id: number
  imageUrl: string
}

interface CategoryPropsType {
  refreshing: boolean
}

const Category = (props: CategoryPropsType) => {
  const { refreshing } = props
  const [current, setCurrent] = useState<number>(0)
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([])
  const [navList, setNavList] = useState<CategoryItemType[][]>([])
  const {
    userStore: { shopAndSite },
  } = useStores()

  const getCategoryList = () => {
    const param: any = {}
    const headers: any = {
      shopId: shopAndSite?.id,
    }

    getProductMobileShopScoreGetCategoryTree(param, { headers }).then((res) => {
      if (res.code === 1000) {
        if (res.data && res.data.length > 0) {
          setCategoryList(res.data as unknown as CategoryItemType[])
          setNavList(arrayGroupsByCount(res.data, 8))
        } else {
          setCategoryList([])
          setNavList([])
        }
      }
    })
  }

  useEffect(() => {
    if (shopAndSite) {
      getCategoryList()
    }
  }, [shopAndSite, shopAndSite])

  useEffect(() => {
    if (refreshing && shopAndSite) {
      getCategoryList()
    }
  }, [refreshing, shopAndSite])

  const paginationData: any = []
  for (let i = 0; i < navList.length; i += 1) {
    paginationData.push(`paginationKey${i}`)
  }

  const _onChange = (e) => {
    setCurrent(e.detail.current)
  }

  return navList && navList.length > 0 ? (
    <View
      style={{ height: categoryList.length > 4 ? pxTransform(200) : pxTransform(100) }}
      className={styles['banner-category-container']}
    >
      <Swiper style={{ height: '100%' }} onChange={_onChange}>
        {navList.map((listItem: CategoryItemType[], index: number) => (
          <SwiperItem key={index} className={styles['banner-category-container-navList']}>
            {listItem.map((item) => (
              <View
                className={styles['banner-category-container-navItem']}
                key={`navItem_${item.id}`}
                onClick={() =>
                  Router.navigateTo('shop/ingralCommodityList', { categoryId: item.id, categoryName: item.name })
                }
              >
                <ImageBox
                  className={styles['banner-category-container-navIcon']}
                  width={48}
                  height={48}
                  source={item.imageUrl}
                />
                <Text className={styles['banner-category-container-navText']}>{item.name}</Text>
              </View>
            ))}
          </SwiperItem>
        ))}
      </Swiper>
      <View className={styles['banner-category-container-pagination']}>
        <View className={styles['banner-category-container-paginationStyle']}>
          {navList.map((item: any, listIndex: number) => (
            <View
              key={`navList_${listIndex}`}
              className={cx(
                styles['banner-category-container-paginationItem'],
                listIndex === current ? styles['banner-category-container-paginationTextActive'] : null,
              )}
            />
          ))}
        </View>
      </View>
    </View>
  ) : null
}
export default Category
