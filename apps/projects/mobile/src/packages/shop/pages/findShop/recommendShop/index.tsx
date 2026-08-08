import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Icons, ActionSheet, ActivityIndicator } from '@apps/mobile-ui'
import Router from '@/utils/router'
import Empty from '@/components/Empty'
// import AddressPicker, { AddressListType } from '@/components/AddressPicker'
import ShopItem from '@/components/ShopItem'
import { useIntl } from '@linkseeks/i18n'
// import { getProductMobileShopEnterpriseGetArea } from '@apps/apis'
import styles from './index.module.scss'

interface RecommendShopProps {
  dataList: any[]
  noMoreDate?: boolean
  current: number
  handleSelectItem: (item: any) => void
  handleAddressSelect: (item: any[]) => void
}

const RecommendShop: React.FC<RecommendShopProps> = (props) => {
  const { dataList, noMoreDate, current, handleSelectItem, handleAddressSelect } = props
  const [visibleOverlay, setVisibleOverlay] = useState<boolean>(false)
  // const [addressPickerVisible, setAddressPickerVisible] = useState(false) // 显示地区选择
  // const [addressList, setAddressList] = useState<AddressListType[]>([])
  const intl = useIntl()

  const _normalizeList = (data: any) => {
    if (!data) {
      return []
    }
    return data.map((item: { provinceName: any; provinceCode: any; cityList: any[] }) => ({
      label: item.provinceName,
      value: item.provinceCode,
      children: item.cityList
        ? item.cityList.map((cityItem) => ({
            label: cityItem.cityName,
            value: cityItem.cityCode,
            children: [],
          }))
        : [],
    }))
  }

  /**
   * 获取地区数据
   */
  // const fetchAdderssList = () => {
  //   getProductMobileShopEnterpriseGetArea().then((res) => {
  //     if (res.code === 1000) {
  //       setAddressList(_normalizeList(res.data))
  //     }
  //   })
  // }

  // useEffect(() => {
  //   fetchAdderssList()
  // }, [])

  const handleCloseOverlay = () => {
    setVisibleOverlay(false)
  }

  const _handleSelectItem = (item: any) => {
    handleSelectItem(item)
    handleCloseOverlay()
  }

  const _handleAddressSelect = (item: any[]) => {
    handleAddressSelect(item)
  }

  const genIndicator = useCallback(() => {
    if (!noMoreDate) {
      return (
        <View className={styles['indicator-container']}>
          <ActivityIndicator className={styles['indicator']} size={20} isOpened />
          <Text className={styles['indicator-ext']}>
            {intl.formatMessage({ id: 'findShop_recommendShop_genIndicator_1' })}
          </Text>
        </View>
      )
    }

    if (current > 1) {
      return (
        <View className={styles['indicator-container']}>
          <Text className={styles['indicator-ext']}>
            {intl.formatMessage({ id: 'findShop_recommendShop_genIndicator_2' })}
          </Text>
        </View>
      )
    }
    return null
  }, [noMoreDate])

  const _renderItem = (item) => {
    return item.status !== 0 ? <ShopItem key={`ShopItem_${item.id}`} {...item} /> : null
  }

  return (
    <View className={styles['recommend-shop-container']}>
      <View className={styles['shop-list']}>
        <View className={styles['filter-wrap']}>
          <View className={styles['filter-item']} onClick={() => setVisibleOverlay(true)}>
            <Text className={styles['filter-text']}>
              {intl.formatMessage({ id: 'findShop_recommendShop_filter_1' })}
            </Text>
          </View>
          {/* <View className={styles['filter-item']} onClick={() => setAddressPickerVisible(true)}>
            <Text className={styles['filter-text']}>{intl.formatMessage({id: 'findShop_recommendShop_filter_2'})}</Text>
            <Icons name='ChevronDown' size={10} color='#606266' />
          </View> */}
        </View>
        {dataList && dataList.length > 0 ? (
          dataList.map((item) => _renderItem(item))
        ) : (
          <Empty description={intl.formatMessage({ id: 'findShop_recommendShop_empty' })} />
        )}
        {genIndicator()}
        {/* <ScrollView
          data={dataList}
          renderItem={_renderItem}
          listHeaderComponent={ }
          listEmptyComponent={<Empty description='暂无数据' />}
          listFooterComponent={genIndicator}
          // onScroll={(e) => console.log(e)}
          // onEndReached={() => {
          //   console.log('innerok')
          // }}
          onEndReachedThreshold={1}
        /> */}
      </View>
      <ActionSheet
        isOpened={visibleOverlay}
        title={intl.formatMessage({ id: 'findShop_recommendShop_actionSheet_title' })}
        cancelText={intl.formatMessage({ id: 'findShop_recommendShop_actionSheet_cancelText' })}
        onClose={handleCloseOverlay}
        onSelect={(_, item) => _handleSelectItem(item)}
        actions={[
          {
            name: intl.formatMessage({ id: 'findShop_recommendShop_actionSheet_actions_0' }),
            value: 0,
          },
          {
            name: intl.formatMessage({ id: 'findShop_recommendShop_actionSheet_actions_2' }),
            value: 2,
          },
          {
            name: intl.formatMessage({ id: 'findShop_recommendShop_actionSheet_actions_1' }),
            value: 1,
          },
        ]}
      />
      {/* <AddressPicker
        actions={addressList}
        visible={addressPickerVisible}
        onClose={() => { setAddressPickerVisible(false) }}
        onSelect={_handleAddressSelect}
      /> */}
    </View>
  )
}

export default RecommendShop
