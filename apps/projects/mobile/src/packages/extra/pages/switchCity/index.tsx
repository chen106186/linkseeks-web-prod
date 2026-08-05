import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: GHua
 * @Date: 2022-03-11 15:30:29
 * @LastEditTime: 2022-03-14 17:47:35
 * @LastEditors: GHua
 * @Description: 切换城市页面
 */
import { pxTransform, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import React, { useEffect, useState } from 'react'
import Router from '@/utils/router'
import { View, Text, Icons, Input, Image, IndexList } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import cx from 'classnames'
import { getManageMobileAreaFindProCityFirstName } from '@apps/apis'
import { IndexListItem, IndexItem } from '@apps/mobile-ui/packages/types/index-list'
import { useIntl } from '@linkseeks/i18n'
import DeviceEventEmitter from '@/utils/lib/DeviceEventEmitter'
import Card from './card'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const positionIcon = getOssUrlPath('/miniprogram/assets/images/position_icon.svg')
interface CityItemType {
  cityName: string
  cityCode: string
  firstName: string
  provinceName: string
  provinceCode: string
}
interface CityListType {
  title: string
  data: CityItemType[]
}
export interface AreaDataItemType {
  provinceCode: string
  provinceName: string
  cityList: CityItemType[]
}
const SwitchCity = () => {
  const {
    locationStore: { currentCity, updateCurrentCity },
  } = useStores()
  const [searchCityList, setSearchCityList] = useState<IndexItem[]>([])
  const [searchValue, setSearchValue] = useState<string>()
  // const sectionListRef = useRef<any>()
  const [dataSource, setDataSource] = useState<IndexListItem[]>([])
  // const HOT_CITY_NAME = ['北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '天津', '武汉', '长沙', '重庆', '成都']
  const intl = useIntl()
  const initDataList = (list: AreaDataItemType[]) => {
    const tempCityList: CityItemType[] = []
    // const tempHotCityList: CityItemType[] = []
    // 1.根据每个城市名获取首字母添加到数据中
    list.forEach((listItem) => {
      if (listItem.cityList) {
        // 判断是否直辖市
        const isMunicipalityCity = listItem.cityList.some((item) => item.cityName === '市辖区')
        if (isMunicipalityCity) {
          const newCityItem: CityItemType = {
            provinceCode: listItem.provinceCode,
            provinceName: listItem.provinceName,
            cityCode: listItem.provinceCode,
            cityName: listItem.provinceName.replace('市', ''),
            firstName: listItem.firstName || '0',
          }
          tempCityList.push(newCityItem)
        } else {
          listItem.cityList.forEach((cityItem) => {
            const newCityItem: CityItemType = {
              provinceCode: listItem.provinceCode,
              provinceName: listItem.provinceName,
              cityCode: cityItem.cityCode,
              cityName: cityItem.cityName.replace('市', ''),
              firstName: cityItem.firstName,
            }
            // if (HOT_CITY_NAME.includes(newCityItem.cityName)) {
            //   tempHotCityList.push(newCityItem)
            // }

            tempCityList.push(newCityItem)
            // setHotCityList(tempHotCityList)
          })
        }
      }
    })
    // 2. 根据首字母对城市数组进行分组
    const newCityList: CityListType[] = []
    tempCityList.forEach((cityItem) => {
      if (newCityList.every((item) => item.title !== cityItem.firstName)) {
        newCityList.push({
          title: cityItem.firstName || '',
          data: [cityItem],
        })
      } else {
        for (let i = 0; i < newCityList.length; i += 1) {
          const newCityItem = newCityList[i]
          if (newCityItem.title === cityItem.firstName) {
            newCityItem.data = [...newCityItem.data, cityItem]
          }
        }
      }
    })
    // 3. 根据字母进行排序
    const sortData = newCityList.sort((a, b) => a.title.localeCompare(b.title))
    const tempSourceList: IndexListItem[] = sortData.map((dataItem) => {
      return {
        key: dataItem.title,
        title: dataItem.title,
        items: dataItem.data.map((childItem) => {
          return {
            name: childItem.cityName,
            key: childItem.firstName,
            ...childItem,
          }
        }),
      }
    })
    console.log(tempSourceList, 'tempSourceList')
    setDataSource(tempSourceList)
    // setCityList(sortData)
  }
  const fetchAreaData = async () => {
    const res = await getManageMobileAreaFindProCityFirstName(
      {},
      {
        useCache: true,
      },
    )
    if (res.code === 1000 && res.data) {
      initDataList(res.data as AreaDataItemType[])
    }
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'switchCity.title' }),
    // })
    fetchAreaData()
  }, [])
  const handleValueChange = (e: any) => {
    const text = e.target.value
    setSearchValue(text)
    console.log(text, 'text')
    if (dataSource && dataSource.length > 0 && text) {
      let filterList: IndexItem[] = []
      dataSource.forEach((item) => {
        if (item.title.indexOf(text) > -1) {
          filterList = [...item.items]
          return
        }
        item.items &&
          item.items.forEach((item) => {
            if (item.name.indexOf(text) > -1) {
              filterList.push(item)
            }
          })
      })
      console.log(filterList, 'filterList')
      if (filterList.length > 0) {
        setSearchCityList(filterList)
      }
    } else {
      setSearchCityList([])
    }
  }
  const onSelectCity = (cityItem: IndexItem) => {
    updateCurrentCity({
      provinceCode: cityItem.provinceCode,
      provinceName: cityItem.provinceName,
      cityCode: cityItem.cityCode,
      cityName: cityItem.cityName,
    })
    DeviceEventEmitter.emit('cityChange')
    Router.navigateBack()
  }
  return (
    <View className={styles.switchCity}>
      <View className={styles.searchWrap}>
        <View className={styles.searchInputWrap}>
          <Icons name="Search" size={20} color="#C8CACD" />
          <Input
            className={styles.searchInput}
            value={searchValue}
            placeholder={intl.formatMessage({
              id: 'switchCity.search.placeholder',
            })}
            onInput={handleValueChange}
            placeholderStyle="#C8CACD"
            // onChangeText={handleValueChange}
          />
        </View>
      </View>
      {searchCityList && searchCityList.length > 0 ? (
        <View className={styles.searchList}>
          {searchCityList.map((searchItem) => (
            <View onClick={() => onSelectCity(searchItem)} className={styles.searchItem}>
              <Text className={styles.cityText}>{searchItem.name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <>
          <View className={styles.sectionListHeader}>
            <Card
              title={intl.formatMessage({
                id: 'switchCity.current.position',
              })}
              paddingStyle={{
                padding: pxTransform(12),
              }}
            >
              <Image
                src={positionIcon}
                style={{
                  width: pxTransform(16),
                  height: pxTransform(16),
                  marginRight: pxTransform(8),
                }}
              />
              <Text className={styles.currentLocationText}>{currentCity?.cityName}</Text>
            </Card>
          </View>
          <IndexList
            list={dataSource as any}
            topKey=" "
            className={styles.sectionList}
            isVibrate={false}
            itemWrapClassName={styles.sectionListWrap}
            isShowToast={false}
            renderItem={(item) => (
              <View
                onClick={() => onSelectCity(item)}
                key={`hot_${item.key}_${item?.name}`}
                className={cx(styles.sectionItem)}
              >
                <Text className={styles.cityText}>{item?.name}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  )
}
export default GlobalWrapper(observer(SwitchCity))
