import React, { useEffect } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { View, Text, ScrollView, Image } from '@apps/mobile-ui'
import GenIndicator from '@/components/GenIndicator'
import { getTradeAppletProductQuotationHistoryList } from '@apps/apis'
import defaultImage from '@/assets/images/default_img.png'
import { dateFmt } from '@/utils/date'
import styles from './index.module.scss'

const ViewHistoryOffer: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as any
  const { commodity } = params
  const loadMoreLoading = React.useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = React.useState<boolean>(false)
  const [current, setCurrent] = React.useState<number>(1)
  const [pageSize] = React.useState<number>(10)
  const [contentList, setContentList] = React.useState<any[]>([])

  const renderItem = ({ item }: { item: any }) => (
    <View className={styles['box']}>
      <View className={styles['box-item']}>
        <View className={`${styles['box-item-cell']} ${styles['box-item-info']}`}>
          <View className={styles['box-item-cell-item']}>
            <View className={styles['box-item-cell-item-label']}>报价单号：</View>
            <Text className={styles['box-item-cell-item-value']}>{item?.quotationNo}</Text>
          </View>
          <View className={styles['box-item-cell-item']}>
            <Text className={styles['box-item-cell-item-value']}>
              {item?.createTime && dateFmt(new Date(item?.createTime))}
            </Text>
          </View>
        </View>
        <View className={styles['box-item-cell']}>
          <View className={styles['box-item-cell-item']}>
            <View className={styles['box-item-cell-item-label']}>询价会员：</View>
            <Text className={styles['box-item-cell-item-value']}>{item?.memberName}</Text>
          </View>
        </View>
        <View className={styles['box-item-cell']}>
          <View className={styles['box-item-cell-item']}>
            <View className={styles['box-item-cell-item-label']}>报价会员：</View>
            <Text className={styles['box-item-cell-item-value']}>{item?.quoteMemberName}</Text>
          </View>
        </View>
        <View className={styles['box-item-cell']}>
          <View className={styles['box-item-cell-item']}>
            <View className={styles['box-item-cell-item-label']}>采购数量：</View>
            <Text className={styles['box-item-cell-item-value']}>x{item?.purchaseCount}</Text>
          </View>
        </View>
        <View className={styles['box-item-cell']}>
          <View className={styles['box-item-cell-item']}>
            <View className={styles['box-item-cell-item-label']}>外部状态：</View>
            <Text className={styles['box-item-cell-item-value']}>{item?.externalStateName}</Text>
          </View>
        </View>
        <View className={styles['box-item-cell']}>
          <View className={styles['box-item-cell-item']}>
            <View className={styles['box-item-cell-item-label']}>内部状态：</View>
            <Text className={styles['box-item-cell-item-value']}>{item?.interiorStateName}</Text>
          </View>
        </View>
        <View className={styles['box-item-amount']}>
          <View className={styles['box-item-amount-item']}>
            <View className={styles['box-item-amount-item-label']}>报价单价：</View>
            <Text className={styles['box-item-amount-item-value']}>¥{item?.price}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const param: any = {
      current: currentPage || current,
      pageSize,
      commoditySkuId: commodity.productId,
    }

    getTradeAppletProductQuotationHistoryList({ ...param }).then((res: any) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setContentList([...contentList, ...data])
            loadMoreLoading.current = false
            setNoMoreData(false)
          }
        } else {
          setContentList(data)
          loadMoreLoading.current = false
          if (data.length < pageSize) {
            setNoMoreData(true)
          } else {
            setNoMoreData(false)
          }
        }
      }
    })
  }

  useEffect(() => {
    fetchContentList()
  }, [])

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  return (
    <View className={styles['container']}>
      <View className={styles['product-box']}>
        <View className={styles['product-box-info']}>
          <View className={styles['product-box-info-left']}>
            <Image src={commodity?.imgUrl || defaultImage} className={styles['product-box-info-left-image']} />
          </View>
          <View className={styles['product-box-info-right']}>
            <Text className={styles['product-box-info-right-text']}>{commodity?.productName}</Text>
          </View>
        </View>
        <View className={styles['product-box-attribute']}>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>品类：</View>
            <Text className={styles['attribute-box-value']}>{commodity?.category}</Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>单位：</View>
            <Text className={styles['attribute-box-value']}>{commodity?.unit}</Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>品牌：</View>
            <Text className={styles['attribute-box-value']}>{commodity?.brand}</Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>含税：</View>
            <Text className={styles['attribute-box-value']}>
              {commodity?.taxRate ? `是/${commodity?.taxRate}%` : '否'}
            </Text>
          </View>
        </View>
      </View>
      <View className={styles['scrollView']}>
        <ScrollView
          className={styles['flatList']}
          renderItem={renderItem}
          data={contentList}
          keyExtractor={(item: any) => `scrollItem${item.id}`}
          onEndReachedThreshold={50}
          horizontal={false}
          listFooterComponent={<GenIndicator noMoreDate={noMoreDate} />}
          onEndReached={() => {
            loadMoreData()
          }}
        />
      </View>
    </View>
  )
}
export default ViewHistoryOffer
