import React, { useEffect, useState } from 'react'
import { Icons, Text, View } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import useFetchState from '@/hooks/useFetchState'
import MellowCard from '@/components/MellowCard'
import ImageBox from '@/components/ImageBox'
import Router from '@/utils/router'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import {
  getProductMobileShopEnterpriseGetBrandByFirstCategory,
  getProductMobileShopEnterpriseGetCategoryTree,
} from '@apps/apis'
import styles from './index.module.scss'

export interface ClassifyItem {
  /**
   * id
   */
  id: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 分类名称
   */
  name: string
  /**
   * logo
   */
  imageUrl: string
  /**
   * 是否选中
   */
  checked: boolean
  /**
   * 子分类
   */
  children?: ClassifyItem[]
}

interface BrandItem {
  /**
   * id
   */
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * logo
   */
  logoUrl: string
}

interface BrandMap {
  [key: string]: BrandItem[]
}

const ClassifyTab: React.FC<{ categoryId: string | undefined }> = (props) => {
  const [dataSource, setDataSource] = useFetchState<ClassifyItem[]>([])
  const [currentNav, setCurrentNav] = useFetchState<ClassifyItem>({
    id: '',
    parentId: '',
    title: '',
    imageUrl: '',
    checked: false,
    children: [],
  })
  const { categoryId: paramCategoryId } = props
  const [brand, setBrand] = useState<BrandMap>({})
  const [brandLoading, setBrandLoading] = useState(false)
  const intl = useIntl()

  const getBrandsBytCategory = (categoryId: string) => {
    if (!categoryId || brandLoading) {
      return
    }
    // 没有请求过则请求
    if (!brand[categoryId]) {
      setBrandLoading(true)
      const newBrand = {
        ...brand,
      }
      getProductMobileShopEnterpriseGetBrandByFirstCategory({
        customerCategoryId: categoryId,
      }).then((res) => {
        if (res.code === 1000) {
          // 最多只展示 6 条
          newBrand[categoryId] = res.data.slice(0, 6)
          setBrand(newBrand)
          setBrandLoading(false)
        }
      })
    }
  }

  const getItemByList = (list: any[]) => {
    const filtered = list.filter((item) => item.id === paramCategoryId)[0]
    if (filtered) {
      return filtered
    }
    return undefined
  }

  const getCategoryTree = () => {
    getProductMobileShopEnterpriseGetCategoryTree().then((res) => {
      if (res.code === 1000) {
        setDataSource(res.data as unknown as ClassifyItem[])
        const first = res.data.length > 0 ? res.data[0] : null
        if (paramCategoryId) {
          const current = getItemByList(res.data)
          if (current) {
            setCurrentNav(current as unknown as ClassifyItem)
            return
          }
        }
        if (first) {
          setCurrentNav(first as unknown as ClassifyItem)
        }
      }
    })
  }

  useEffect(() => {
    getCategoryTree()
  }, [])

  useEffect(() => {
    getBrandsBytCategory(currentNav.id)
  }, [currentNav])

  const handleSelectNav = (record: ClassifyItem) => {
    setCurrentNav(record)
  }

  /**
   * 选择品牌跳转
   * @param item BrandItem
   */
  const handleFilterBrand = (item: BrandItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', { type: 1, brandId: item.id, categoryId: currentNav?.id })
  }

  /**
   * 选择品类跳转
   * @param item BrandItem
   */
  const handleFilterCategory = (item: ClassifyItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', { type: 1, categoryId: item.id })
  }

  return (
    <View className={styles['classify']}>
      <View className={styles['classify-tab']}>
        <ScrollView scrollY className={styles['classify-tab-navWrap']}>
          <View className={styles['classify-tab-nav']}>
            {dataSource.map((item, index) => {
              const currentIndex = dataSource.findIndex((dataSourceItem) => dataSourceItem.id === currentNav.id)
              return (
                <View
                  key={item.id}
                  className={cx(
                    'classify-tab-nav-itemWrap',
                    currentNav.id === item.id ? 'classify-tab-nav-itemWrap__active' : null,
                  )}
                >
                  <View
                    className={cx(
                      styles['classify-tab-nav-item'],
                      currentNav.id === item.id ? styles['classify-tab-nav-item__active'] : null,
                      index === currentIndex - 1 ? styles['classify-tab-nav-item__active-prev'] : null,
                      index === currentIndex + 1 ? styles['classify-tab-nav-item__active-next'] : null,
                    )}
                    onClick={() => handleSelectNav(item)}
                  >
                    <View className={styles['classify-tab-nav-item-textWrap']}>
                      <Text
                        className={cx(
                          styles['classify-tab-nav-item-text'],
                          currentNav.id === item.id ? styles['classify-tab-nav-item-text__active'] : null,
                        )}
                      >
                        {item.name}
                      </Text>
                      {currentNav.id === item.id ? <View className={styles['classify-tab-nav-item-line']} /> : null}
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
        <ScrollView scrollY className={styles['classify-tab-menuWrap']}>
          <View className={styles['classify-tab-menu']}>
            {/* <MellowCard
              title={intl.formatMessage({ id: 'classify_brandList_card_title' })}
              headStyle={{ borderBottomWidth: pxTransform(0) }}
              bodyStyle={{
                paddingTop: pxTransform(0),
              }}
              className={styles['recommend']}
            >
              {!brandLoading && (
                <View className={styles['recommend-list']}>
                  {brand[currentNav.id] &&
                    brand[currentNav.id].map((item) => (
                      <View
                        key={item.id}
                        className={styles['recommend-list-item']}
                        onClick={() => handleFilterBrand(item)}
                      >
                        <View className={styles['recommend-list-item-content']}>
                          <ImageBox
                            source={item.logoUrl}
                            width="100%"
                            height="100%"
                            className={styles['recommend-list-item-content-img']}
                          />
                        </View>
                      </View>
                    ))}
                </View>
              )}
            </MellowCard> */}
            <View className={styles['classify-list']}>
              {currentNav.children?.map((item) =>
                item.children && item.children.length > 0 ? (
                  <MellowCard
                    key={item.id}
                    title={
                      <View
                        className={styles['recommend-list-item-titleWrap']}
                        onClick={() => handleFilterCategory(item)}
                      >
                        <Text className={styles['recommend-list-item-title']}>{item.name}</Text>
                        <Icons name="ChevronRight" size={12} />
                      </View>
                    }
                    headStyle={{ borderBottomWidth: pxTransform(0) }}
                    bodyStyle={{
                      paddingTop: pxTransform(0),
                    }}
                    className={styles['classify-list-item']}
                  >
                    <View className={styles['classify-list-content']}>
                      {item.children?.map((child) => (
                        <View
                          key={child.id}
                          className={styles['classify-list-box']}
                          onClick={() => handleFilterCategory(child)}
                        >
                          <View className={styles['classify-list-box-content']}>
                            <View className={styles['classify-list-box-content-imgWrap']}>
                              <ImageBox
                                source={child.imageUrl}
                                width="100%"
                                height="100%"
                                className={styles['recommend-list-item-content-img']}
                              />
                            </View>
                            <Text className={styles['classify-list-box-content-text']}>{child.name}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </MellowCard>
                ) : (
                  <MellowCard
                    key={item.id}
                    title={
                      <View
                        className={styles['recommend-list-item-titleWrap']}
                        onClick={() => handleFilterCategory(item)}
                      >
                        <Text className={styles['recommend-list-item-title']}>{item.name}</Text>
                        <Icons name="ChevronRight" size={12} className={styles['recommend-list-item-arrow']} />
                      </View>
                    }
                    headStyle={{ borderBottomWidth: pxTransform(0) }}
                    className={styles['classify-list-item']}
                    bodyStyle={{
                      padding: pxTransform(0),
                    }}
                  />
                ),
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
export default ClassifyTab
