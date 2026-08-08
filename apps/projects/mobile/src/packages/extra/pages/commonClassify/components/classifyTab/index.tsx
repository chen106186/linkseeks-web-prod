import React, { useEffect } from 'react'
import { Icons, Text, View, Image, ScrollView, Toast } from '@apps/mobile-ui'
import cx from 'classnames'
import { showLoading, hideLoading, pxTransform } from '@apps/mobile-services/utils/taro'
import EmptyLayout from '@/components/Empty'
import useFetchState from '@/hooks/useFetchState'
import MellowCard from '@/components/MellowCard'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import { getIntl } from '@linkseeks/i18n'
import {
  getProductMobileShopSelfGetCustomerCategoryTree,
  getProductMobileShopStoreGetCustomerCategoryTree,
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

interface ClassifyTabPropsType {
  id: string | undefined
  categoryId: string | undefined
}

const ClassifyTab = ({ id, categoryId }: ClassifyTabPropsType) => {
  const [dataSource, setDataSource] = useFetchState<ClassifyItem[]>([])
  const [currentNav, setCurrentNav] = useFetchState<ClassifyItem>({
    id: '',
    parentId: '',
    title: '',
    imageUrl: '',
    checked: false,
    children: [],
  })
  const {
    userStore: { shopAndSite },
  } = useStores()

  const getItemByList = (list: any[]) => {
    const item = list.filter((item) => item.id === categoryId)[0]
    if (item) {
      return item
    }
    return undefined
  }

  const getCategoryTree = () => {
    let getFn
    const params: any = {}
    const headers: any = {
      shopId: shopAndSite?.id,
    }

    if (shopAndSite?.isSelf) {
      params.memberId = shopAndSite?.memberId
      getFn = getProductMobileShopSelfGetCustomerCategoryTree
    } else {
      params.storeId = id
      getFn = getProductMobileShopStoreGetCustomerCategoryTree
    }

    showLoading()
    getFn &&
      getFn(params, { headers }).then((res) => {
        if (res.code !== 1000) {
          hideLoading()
          Toast.show({
            title: getIntl().formatMessage({ id: `${res.code}`, defaultMessage: res.message }),
            icon: 'none',
          })
          return
        }
        hideLoading()
        setDataSource(res.data as unknown as ClassifyItem[])
        const first = res.data.length > 0 ? res.data[0] : null
        if (categoryId) {
          const current = getItemByList(res.data)
          if (current) {
            setCurrentNav(current as unknown as ClassifyItem)
            return
          }
        }

        if (first) {
          setCurrentNav(first as unknown as ClassifyItem)
        }
      })
  }

  useEffect(() => {
    getCategoryTree()
  }, [id, categoryId])

  const handleSelectNav = (record: ClassifyItem) => {
    setCurrentNav(record)
  }

  /**
   * 选择品类跳转
   * @param item BrandItem
   */
  const handleFilterCategory = (item: ClassifyItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', {
      categoryId: item.id,
      categoryName: item.name,
      id: id !== undefined ? +id : undefined, // 店铺id
    })
  }

  return (
    <View className={styles['tab']}>
      <ScrollView scrollY className={styles['tab-navWrap']}>
        <View className={styles['tab-nav']}>
          {dataSource.map((item, index) => {
            const currentIndex = dataSource.findIndex((dataSourceItem) => dataSourceItem.id === currentNav.id)
            return (
              <View
                key={item.id}
                className={cx(
                  styles['tab-nav-itemWrap'],
                  currentNav.id === item.id ? styles['tab-nav-itemWrap__active'] : null,
                )}
              >
                <View
                  className={cx(
                    styles['tab-nav-item'],
                    currentNav.id === item.id ? styles['tab-nav-item__active'] : null,
                    index === currentIndex - 1 ? styles['tab-nav-item__active-prev'] : null,
                    index === currentIndex + 1 ? styles['tab-nav-item__active-next'] : null,
                  )}
                  onClick={() => handleSelectNav(item)}
                >
                  <View className={styles['tab-nav-item-textWrap']}>
                    <Text
                      className={cx(
                        styles['tab-nav-item-text'],
                        currentNav.id === item.id ? styles['tab-nav-item-text__active'] : null,
                      )}
                    >
                      {item.name}
                    </Text>
                    {currentNav.id === item.id ? <View className={styles['tab-nav-item-line']} /> : null}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
      <ScrollView scrollY className={styles['tab-menuWrap']}>
        <View className={styles['tab-menu']}>
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
                  className={styles['classify-list-item']}
                >
                  <View className={styles['classify-list-content']}>
                    {item.children?.map((child) => (
                      <View
                        key={child.id}
                        className={styles['classify-list-box']}
                        onClick={() => handleFilterCategory(child)}
                      >
                        <View className={styles['lassify-list-box-content']}>
                          <View className={styles['classify-list-box-content-imgWrap']}>
                            <Image src={child.imageUrl} className={styles['classify-list-box-content-img']} />
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
            {currentNav.children?.length === 0 && <EmptyLayout />}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
export default ClassifyTab
