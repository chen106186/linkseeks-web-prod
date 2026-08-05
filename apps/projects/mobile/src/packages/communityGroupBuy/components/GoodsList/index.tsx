import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { checkMore } from '@/utils'
import Loading from '@/components/Loading'
import Empty from '@/components/Empty'

import styles from './index.module.scss'

interface UserInfoProps {
  id: string
  type: string
}

interface GoodsParams {
  /**
   * 当前页
   */
  current?: string
  /**
   * 每页行数
   */
  pageSize?: string
}

const GoodsItemCrad: React.FC<UserInfoProps> = (props: UserInfoProps) => {
  const { id, type } = props
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
    {
      name: '海南妃子笑荔枝5斤新鲜水果当季现枝5斤新鲜水果当季现',
      price: '+2,060.90',
      type: '母婴-洗护用品-宝宝护肤',
      orderNo: 'TS823640',
      time: '2022-01-29 12:59:12',
    },
  ])

  // const getList = (params?: GoodsParams): Promise<> => {
  //   // 获取数据，参考LevelHistory组件

  //   // if (loading || !hasMore) {
  //   //   return Promise.reject()
  //   // }

  //   // const nextPage = params?.current || page
  //   // setLoading(true)
  // }

  // useEffect(() => {
  //   getList()
  //     .then((res) => {
  //       setList(list.concat(res))
  //     })
  //     .catch(() => {})
  // }, [page])

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    setPage(page + 1)
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View className={styles['item']} key={index}>
        {type === '2' ? (
          <View className={styles['buy-info']}>
            <Text className={styles['buy-name']}>下单会员：李明</Text>
            <Text>直接分销返现</Text>
          </View>
        ) : null}
        <View className={styles['item-box']}>
          <View className={styles['top']}>
            <Text className={styles['name']}>{item.name}</Text>
            <Text className={styles['price']}>{item.price}</Text>
          </View>
          <View className={styles['mt10']}>
            <Text>品类：{item.type}</Text>
          </View>
          <View className={styles['mt10']}>
            <Text>关联订单号：{item.orderNo}</Text>
          </View>
          <View className={styles['mt10']}>
            <Text>返现到账时间：{item.time}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.list}>
      <ScrollView
        scrollY
        data={list}
        refresherEnabled
        lowerThreshold={1}
        onScrollToLower={handleLoadMore}
        className={styles['scroll-list']}
        renderItem={renderItem}
        listEmptyComponent={<Empty />}
        listFooterComponent={
          list.length ? (
            <Loading loading={loading} noMore={hasMore} customStyle={{ marginTop: pxTransform(24) }} />
          ) : null
        }
      ></ScrollView>
    </View>
  )
}

GoodsItemCrad.defaultProps = {
  id: '0',
  type: '1',
}

export default GoodsItemCrad
