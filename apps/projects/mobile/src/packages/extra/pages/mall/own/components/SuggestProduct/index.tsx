import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react'
import { pxTransform, createSelectorQuery } from '@apps/mobile-services/utils/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import { getMarketingMobileActivityGoodsAreaAdorn } from '@apps/apis'
import { View, Text, Tabs } from '@apps/mobile-ui'
import { CurrentCityType } from '@/store/locationStore/model'
import Item from './Item'
import styles from './index.module.scss'

interface CustomizeType {
  id: number
  tags: string[]
}

interface ItemType {
  num: number
  type: number
  explain: string
  title: string
  customize: CustomizeType[] | undefined
}

interface SuggesProductProps {
  details: ItemType[]
  shopId: number
  memberId: number
  memberRoleId: number
  scroll?: boolean
  ref?: any
  refreshing: boolean
  currentCity: CurrentCityType | undefined
}

const SuggesProduct: React.FC<SuggesProductProps> = (props) => {
  const { details, shopId, memberId, memberRoleId, refreshing, currentCity } = props
  const [activeKey, setActiveKey] = useState<number>(0)
  const [productList, setProductList] = useState<any[]>([])
  const [swiperHeight, setSwiperHeight] = useState<number>(0)
  const BOTTOM_HEIGHT = 30

  useLayoutEffect(() => {
    setTimeout(() => {
      createSelectorQuery()
        .select(`#swiperItem_view_${activeKey}`)
        .boundingClientRect((rect) => {
          if (rect) {
            setSwiperHeight(rect.height + BOTTOM_HEIGHT)
          }
        })
        .exec()
    }, 500)
  }, [activeKey, productList])

  const fetchProductList = async (type: number, maxNum: number, customize: any) => {
    const _params: any = {
      shopId,
      type,
      current: 1,
      pageSize: maxNum && maxNum > 50 ? 50 : maxNum,
      memberId,
      memberRoleId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    if (type === 3 && customize) {
      _params.idInList = customize.map((item: any) => item.id).join(',')
    }
    try {
      const res = await getMarketingMobileActivityGoodsAreaAdorn(_params)
      if (res.code === 1000) {
        const _data = res.data.data
        const _list: any = _data.map((item: any, index: any) => {
          const _obj: any = {
            productName: item.name,
            productImg: item.mainPic,
            discount: item.price,
            productId: item.id,
          }
          if (type === 3) {
            _obj.tags = customize[index]?.tags?.map((_row) => ({
              name: _row,
              type: 'danger',
            })) as any[]
          }
          return _obj
        })
        return _list
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const fetchAllProductList = async () => {
    if (details && details.length > 0) {
      const finalList: any[] = []
      for (let i = 0; i < details.length; i++) {
        const item = details[i]
        if (item?.type) {
          const list = await fetchProductList(item?.type, item?.num || 50, item?.customize)
          finalList.push({
            index: i,
            list: list,
          })
        } else {
          finalList.push({
            index: i,
            height: BOTTOM_HEIGHT,
            list: [],
          })
        }
      }
      setProductList(finalList)
    }
  }

  useEffect(() => {
    fetchAllProductList()
  }, [currentCity])

  useEffect(() => {
    if (refreshing) {
      fetchAllProductList()
    }
  }, [refreshing])

  const _renderTabItems = useMemo(() => {
    if (details && details.length > 0) {
      const _tabItemList: any[] = []
      for (const item of details) {
        if (item.title) {
          _tabItemList.push({
            title: (
              <View className={styles['tab-item']}>
                <Text className={styles['tab-item-title']}>{item?.title}</Text>
                <Text className={styles['tab-item-explain']}>{item?.explain}</Text>
              </View>
            ),
          })
        }
      }
      return _tabItemList
    }
    return []
  }, [details])

  const handleTabClick = (index: number) => {
    setActiveKey(index)
  }

  const handleSwiperChange = (e) => {
    setActiveKey(e.detail.current)
  }

  return (
    <View className={styles['suggest-product']} id="suggestProduct">
      <Tabs
        current={activeKey}
        tabList={_renderTabItems}
        onClick={handleTabClick}
        transparentBg
        hideUnderLine
        activeColor="#00A98F"
      />
      {productList && productList.length > 0 && (
        <Swiper
          current={activeKey}
          duration={300}
          style={{ height: pxTransform(swiperHeight || 120) }}
          onChange={handleSwiperChange}
        >
          {productList.map((productItem) => (
            <SwiperItem key={`pannel_${productItem.index}`}>
              <View id={`swiperItem_view_${productItem.index}`}>
                <Item list={productItem.list || []} />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      )}
    </View>
  )
}

SuggesProduct.defaultProps = {
  scroll: true,
}

export default SuggesProduct
