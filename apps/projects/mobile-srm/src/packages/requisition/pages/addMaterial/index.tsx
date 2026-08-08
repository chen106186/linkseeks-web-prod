import React, { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { View, Text, Icons, ScrollView, Image } from '@apps/mobile-ui'
import cx from 'classnames'
import useStores from '@/store/useStores'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import Search from '@/components/Search'
import Empty from '@/components/Empty'
import Router from '@/utils/router'
import GenIndicator from '@/components/GenIndicator'
import { useSafeArea } from '@apps/mobile-services'
import { getProductGoodsGetGoodsByMemberListSrm } from '@apps/apis'
import styles from './index.module.scss'

let flag: boolean = true

const AddMaterial: React.FC<{}> = () => {
  const {
    createStore: { products, vendorMemberId, vendorRoleId, setCreateValues },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const loadMoreLoading = useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [contentList, setContentList] = useState<any[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [keyWord, setKeyWord] = useState<string>('')
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [watch, setWatch] = useState<boolean>(false)
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    setRecords(toJS(products))
  }, [products])

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const params: any = {
      current: currentPage || current,
      pageSize,
      watch,
      materialGroupId: '',
    }
    if (vendorMemberId) params.memberId = vendorMemberId
    if (vendorRoleId) params.memberRoleId = vendorRoleId
    if (keyWord && flag) params.name = keyWord

    getProductGoodsGetGoodsByMemberListSrm({ ...params }).then((res: any) => {
      if (res.code === 1000) {
        const { data } = res.data
        const _data = data?.map((item) => {
          return {
            ...item,
            productId: item.id,
            productNo: item.code,
            spec: item.type,
            brand: item.brand?.name,
            category: item.customerCategory?.name,
            goodsGroup: item.materialGroup?.name,
            unit: item.unitName,
            price: item.costPrice,
          }
        })
        if (merge) {
          if (!_data || _data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setContentList([...contentList, ..._data])
            loadMoreLoading.current = false
            setNoMoreData(false)
          }
        } else {
          setContentList(_data)
          loadMoreLoading.current = false
          if (_data.length < pageSize) {
            setNoMoreData(true)
          } else {
            setNoMoreData(false)
          }
        }
      }
    })
  }

  /** 搜索 */
  const handleSearchSubmit = (val: string) => {
    setKeyWord(val)
    setCurrent(1)
    flag = true
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  /** 清除搜索 */
  const handleClearSubmit = (val: string) => {
    setKeyWord(val)
    setCurrent(1)
    flag = false
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  const refreshFn = () => {
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    fetchContentList(1, false)
  }

  const handleCreate = () => {
    // const _products = toJS(products);
    // for (let i = 0; i < _products.length; i++) {
    //   const _index = records.findIndex((item: any) => item.productId === _products[i].productId);
    //   if (_index >= 0) {
    //     showToast({ title: `已存在物料:${records[_index]?.name}`, icon: 'none' });
    //     return;
    //   }
    // }
    setCreateValues('products', [...records])
    Router.navigateBack()
  }

  const _handleSelect = (item) => {
    const _index = records.findIndex((_item) => _item.productId === item.productId)
    let _records = [...records]
    if (_index >= 0) {
      _records.splice(_index, 1)
      setRecords(_records)
    } else {
      setRecords([...records, item])
    }
  }

  const _checkSelect = (item) => {
    // const _products = toJS(products);
    return records.findIndex((_item) => _item.productId === item.productId) >= 0
  }

  useEffect(() => {
    fetchContentList(1, false)
  }, [watch])

  /** 列表数据 */
  const renderItem = ({ item }: { item: any }) => (
    <View
      className={styles['materialItem']}
      onClick={() => {
        _handleSelect(item)
      }}
    >
      <View className={styles['materialItem-top']}>
        <Text className={styles['materialItem-top-no']}>物料编号：{item.code}</Text>
        <Image
          className={styles['materialItem-top-image']}
          src={
            _checkSelect(item) ? require('@/assets/images/Checked-@2x.png') : require('@/assets/images/Default@2x.png')
          }
        />
      </View>
      <Text className={styles['materialItem-name']}>{item.name}</Text>
      <View className={styles['materialItem-row']}>
        <Text className={styles['materialItem-row-label']}>物料组</Text>
        <Text className={styles['materialItem-row-text']}>{item?.goodsGroup}</Text>
      </View>
      <View className={styles['materialItem-row']}>
        <Text className={styles['materialItem-row-label']}>品类</Text>
        <Text className={styles['materialItem-row-text']}>{item?.category}</Text>
      </View>
      <View className={styles['materialItem-row']}>
        <Text className={styles['materialItem-row-label']}>品牌</Text>
        <Text className={styles['materialItem-row-text']}>{item?.brand}</Text>
      </View>
    </View>
  )

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    refreshFn()
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  return (
    <View className={styles['addMaterial']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title="添加物料" />
            <View className={styles['addMaterial-header']}>
              <Search
                placeholder="商品名称/品类"
                onChange={(value) => setKeyWord(value)}
                onSearch={(value) => handleSearchSubmit(value)}
                onClear={(value) => handleClearSubmit(value)}
                searchOnClearAction={false}
                shape="round"
                clearable
              />
              <View className={styles['filter']}>
                <View className={styles['filter-sort-bar']}>
                  <View className={styles['filter-sort-bar-list']}>
                    <View className={styles['filter-sort-bar-list-item']} onClick={() => setWatch(false)}>
                      <Text className={cx(styles['filter-sort-bar-list-item-name'], !watch && styles['active'])}>
                        全部
                      </Text>
                    </View>
                    <View className={styles['filter-sort-bar-list-item']} onClick={() => setWatch(true)}>
                      <Text className={cx(styles['filter-sort-bar-list-item-name'], watch && styles['active'])}>
                        供应商可供物料
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        }
      >
        <View className={styles['addMaterial-scrollView']}>
          <ScrollView
            className={styles['addMaterial-flatList']}
            data={contentList}
            renderItem={renderItem}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            listEmptyComponent={<Empty />}
            listFooterComponent={JSON.stringify(contentList) !== '[]' ? <GenIndicator noMoreDate={noMoreDate} /> : null}
            horizontal={false}
            refresherEnabled
            refresherTriggered={refreshing}
            onRefresherRefresh={() => handleRefresh()}
            onEndReached={() => {
              loadMoreData()
            }}
          />
          <View
            className={styles['addMaterial-fixButton']}
            style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
          >
            <View className={styles['addMaterial-fixButton-btn']} onClick={handleCreate}>
              <Text className={styles['addMaterial-fixButton-btn-text']}>确定</Text>
            </View>
          </View>
        </View>
      </PageLayout>
    </View>
  )
}
export default observer(AddMaterial)
