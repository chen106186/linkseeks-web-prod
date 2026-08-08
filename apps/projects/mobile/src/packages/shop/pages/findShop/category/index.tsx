import React, { forwardRef, useEffect, useState } from 'react'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import { Text, Image, ScrollView } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import {
  getProductMobileShopEnterpriseGetFirstCategory,
  GetProductMobileShopEnterpriseGetFirstCategoryResponse,
} from '@apps/apis'
import styles from './index.module.scss'

const defaultImg = getOssUrlPath('/miniprogram/assets/images/default_img.png')
const categoryAllIcon = getOssUrlPath('/miniprogram/assets/images/category_all_icon.png')

interface CategoryProps {
  onChange: (categoryId: number) => void
  categoryId: number
}

const Category = forwardRef((props: CategoryProps, ref: any) => {
  const { onChange, categoryId } = props
  const [firstCategoryList, setFirstCategoryList] = useState<GetProductMobileShopEnterpriseGetFirstCategoryResponse>([])
  const windowWidth = getSystemInfoSync().windowWidth
  const intl = useIntl()

  // const [currentCategoryId, setCurrentCategoryId] = useState<number>(0)

  const fetchFirshCategoryList = () => {
    getProductMobileShopEnterpriseGetFirstCategory().then((res) => {
      if (res.code === 1000) {
        setFirstCategoryList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchFirshCategoryList()
  }, [])

  const handleSearch = (item: any) => {
    onChange(item.id)
    // navigation.navigate('SearchPage', { type: 2, categoryId: item.id, categoryName: item.name })
  }

  const _judgeActive = (id: number) => {
    if (id === categoryId) {
      return true
    }
    return false
  }

  return firstCategoryList && firstCategoryList.length > 0 ? (
    <View className={styles['category-container']} ref={ref}>
      <ScrollView horizontal style={{ width: pxTransform(windowWidth - 32), whiteSpace: 'nowrap' }}>
        <View>
          <View className={styles['nav-item']} onClick={() => handleSearch({ id: 0 })}>
            <Image
              className={`${styles['nav-icon']} ${_judgeActive(0) ? styles['active'] : ''}`}
              src={categoryAllIcon}
              // defaultSource={defaultImg}
            />
            <Text className={`${styles['nav-text']} ${_judgeActive(0) ? styles['nav-text-active'] : ''}`}>
              {intl.formatMessage({ id: 'findShop_category_all' })}
            </Text>
          </View>
        </View>
        {firstCategoryList &&
          firstCategoryList.map((item) => (
            <View key={`navItem_${item.id}`}>
              <View className={styles['nav-item']} onClick={() => handleSearch(item)}>
                {item.imageUrl ? (
                  <Image
                    className={`${styles['nav-icon']} ${_judgeActive(item.id) ? styles['active'] : ''}`}
                    src={item.imageUrl}
                  />
                ) : (
                  <Image
                    className={`${styles['nav-icon']} ${_judgeActive(item.id) ? styles['active'] : ''}`}
                    src={defaultImg}
                  />
                )}
                <Text className={`${styles['nav-text']} ${_judgeActive(item.id) ? styles['nav-text-active'] : ''}`}>
                  {item.name}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  ) : null
})

export default Category
