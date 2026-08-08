import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Icons, Input, ScrollView } from '@apps/mobile-ui'
import { showLoading, hideLoading, setStorageSync, getStorageSync } from '@apps/mobile-services/utils/taro'
import { postMarketingMobileCbgActivityPickupList } from '@apps/apis'
import useStores from '@/store/useStores'
import AreaPopup, { AreaValueType } from '../../components/AreaPopup'
import EmptyLayout from '@/components/Empty/index'
import cs from 'classnames'
import styles from './index.module.scss'
import { observer } from 'mobx-react-lite'
import { checkMore } from '@/utils'
import Router from '@/utils/router'

const CommunityGroupBuyChangeSelfPickupAddress: React.FC<{}> = () => {
  const intl = useIntl()
  const {
    groupBuyStore: { pickupPointInfo, setPickupPointInfo },
    locationStore: { currentCity, getCurrentCity },
  } = useStores()

  const [defaultArea, setDefaultArea] = useState<AreaValueType | null>(null) // 默认地址
  const [area, setArea] = useState<AreaValueType | null>(null) // 选中地址
  const [visibleAreaPopup, setVisibleAreaPopup] = useState(false) // 地址选择弹窗是否显示
  const [searchWord, setSearchWord] = useState('') // 搜索词

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)
  const [pickupPointList, setPickupPointList] = useState<any>([]) // 自提点列表

  useEffect(() => {
    if (pickupPointInfo?.teamLeaderId) {
      setDefaultArea({
        provinceCode: pickupPointInfo.pickupPointProvinceCode,
        provinceName: pickupPointInfo.pickupPointProvince,
        cityCode: pickupPointInfo.pickupPointCityCode,
        cityName: pickupPointInfo.pickupPointCity,
        districtCode: '',
        districtName: '',
      })
    } else {
      getCurrentCity()
    }
  }, [])

  useEffect(() => {
    if (!pickupPointInfo?.teamLeaderId) {
      setDefaultArea({
        provinceCode: currentCity?.provinceCode || '',
        provinceName: currentCity?.provinceName || '',
        cityCode: currentCity?.cityCode || '',
        cityName: currentCity?.cityName || '',
        districtCode: '',
        districtName: '',
      })
    }
  }, [currentCity])

  const handleAreaChange = (value) => {
    setArea(value)
    getPickupPointList(value)
  }

  const handleSearchWordChange = (value) => {
    setSearchWord(value)
    getPickupPointList(area, value)
  }

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getPickupPointList()
  }

  const getPickupPointList = (selectedArea?: AreaValueType | null, name?: string) => {
    let _area = selectedArea || area || null
    if (!_area?.provinceCode || loading) return
    setLoading(true)
    showLoading()
    let postData = {
      teamLeaderId: pickupPointInfo.teamLeaderId || 0,
      name: name || searchWord,
      provinceCode: _area?.provinceCode || '',
      cityCode: _area?.cityCode || '',
      streetCode: '',
      areaCode: '',
      current: pageRef.current,
      pageSize: 10,
    }
    postMarketingMobileCbgActivityPickupList(postData)
      .then((res) => {
        if (res.code === 1000) {
          setHasMore(checkMore(postData.current, postData.pageSize, res.data.data.length, res.data.totalCount))
          if (postData.current === 1) {
            setPickupPointList(res.data.data)
          } else {
            setPickupPointList(pickupPointList.concat(res.data.data))
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
        hideLoading()
      })
  }

  return (
    <View className={styles['container']}>
      <View className={styles['top']}>
        <View className={styles['city']} onClick={() => setVisibleAreaPopup(true)}>
          <View className={styles['city-view']}>
            <Icons name="Address" size={16} color="#252D37" />
            <Text className={styles['city-text']}>
              {area?.provinceName}
              {area?.cityName}
              {area?.districtName}
            </Text>
            <Icons name="ChevronDown" size={12} color="#91959B" />
          </View>
        </View>
        <View className={styles['search-box']}>
          <Icons name="Search" size={20} color="#C8CACD" />
          <Input
            className={styles['search-box-input']}
            value={searchWord}
            placeholder={intl.formatMessage({
              id: 'communityGroupBuy.changeSelfPickupAddress.qingshuruzitidianmingcheng',
              defaultMessage: '请输入自提店名称',
            })}
            placeholderStyle="color: #91959B;"
            onChange={handleSearchWordChange}
          />
        </View>
      </View>
      <ScrollView
        className={styles['address-list']}
        scrollY
        refresherEnabled
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.05}
        onScrollToLower={handleLoadMore}
        refreshing={loading}
        onRefresh={() => {
          pageRef.current = 1
          getPickupPointList()
        }}
      >
        {pickupPointList.length > 0 ? (
          pickupPointList.map((item) => (
            <View
              className={cs(styles['item'], item.teamLeaderId == pickupPointInfo?.teamLeaderId && styles['selected'])}
              key={item.teamLeaderId}
              onClick={() => {
                if (item.teamLeaderId !== pickupPointInfo?.teamLeaderId) {
                  setPickupPointInfo(item)
                  if (getStorageSync('first2') == 1) {
                    setStorageSync('pickupPointInfo', JSON.stringify(item))
                    setStorageSync('first2', 2)
                  }
                  Router.navigateBack()
                }
              }}
            >
              <View className={styles['item-top']}>
                <View className={styles['item-top-left']}>
                  <View>
                    <Text className={styles['item-top-left-name']}>{item.pickupPointName}</Text>
                    {item.teamLeaderId == pickupPointInfo?.teamLeaderId && (
                      <Text className={styles['item-top-left-tag']}>
                        {intl.formatMessage({
                          id: 'communityGroupBuy.changeSelfPickupAddress.dangqian',
                          defaultMessage: '当前',
                        })}
                      </Text>
                    )}
                  </View>
                  <View className={styles['item-top-left-tel']}>{item.phone}</View>
                </View>
                {item.teamLeaderId != pickupPointInfo?.teamLeaderId && (
                  <View className={styles['item-top-right']}>
                    {intl.formatMessage({
                      id: 'communityGroupBuy.changeSelfPickupAddress.xuanzhege',
                      defaultMessage: '选这个',
                    })}
                  </View>
                )}
              </View>
              <View className={styles['item-detail']}>
                {item.pickupPointProvince}
                {item.pickupPointCity}
                {item.pickupPointArea}
                {item.pickupPointStreet}
                {item.pickupPointAddress}
              </View>
            </View>
          ))
        ) : (
          <View style="background-color: #fff;">
            <EmptyLayout />
          </View>
        )}
      </ScrollView>

      <AreaPopup
        visible={visibleAreaPopup}
        defaultArea={defaultArea}
        onClose={() => setVisibleAreaPopup(false)}
        onChange={handleAreaChange}
      />
    </View>
  )
}

export default GlobalWrapper(observer(CommunityGroupBuyChangeSelfPickupAddress))
