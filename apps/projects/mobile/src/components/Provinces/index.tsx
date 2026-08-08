import React, { useState, useEffect } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { PickerView, PickerViewColumn } from '@tarojs/components'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { View, Text, ActionSheet, Picker } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { getMemberAreaCity, getMemberAreaDistrict, getMemberAreaProvince } from '@apps/apis'
import cx from 'classnames'
import './index.scss'

interface AddressPickerProps {
  // 显示控制
  visible?: boolean
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any, allMap?: any) => void
}
const Provinces = (props: AddressPickerProps) => {
  const { visible, onClose, onSelect } = props
  const [provinceList, setProvinceList] = useState<any>([]) // 省
  const [cityList, setCityList] = useState<any>([]) // 市
  const [countryList, setCountyList] = useState<any>([]) // 区
  const [provinceIndex, setProvinceIndex] = useState(0) //省下标
  const [cityIndex, setCityIndex] = useState(0) // 市下标
  const [distIndex, setDistIndex] = useState(0) // 区下标
  const intl = useIntl()
  /* 监听滚动的值 */
  const handlePickerChange = async (val) => {
    if (provinceIndex !== val[0] && val[0]) {
      setProvinceIndex(val[0])
      const cityRes: any = await getMemberAreaCity({ code: provinceList[val[0]].code })
      const distrRes: any = await getMemberAreaDistrict({ code: cityRes.data[0].code })
      batchedUpdates(() => {
        setCityList(cityRes.data)
        setCityIndex(0)
        setCountyList(distrRes.data)
        setDistIndex(0)
      })
    } else {
      if (cityIndex !== val[1]) {
        const distrRes: any = await getMemberAreaDistrict({ code: cityList[val[1]].code })
        batchedUpdates(() => {
          setCountyList(distrRes.data)
          setCityIndex(val[1])
        })
      } else {
        setDistIndex(val[2])
      }
    }
  }
  /* 获取区 */
  const getAreaDistrict = async (code: string) => {
    const distrRes: any = await getMemberAreaDistrict({ code })
    await setCountyList(distrRes.data)
  }
  /* 获取市 */
  const getAreaCity = async (code: string) => {
    const cityRes: any = await getMemberAreaCity({ code })
    if (cityRes.code === 1000) {
      await setCityList(cityRes.data)
      await getAreaDistrict(cityRes.data[0].code)
    }
  }
  /* 获取省 */
  const getProvinceList = async () => {
    const provinceRes: any = await getMemberAreaProvince()
    if (provinceRes.code === 1000) {
      await setProvinceList(provinceRes.data)
      await getAreaCity(provinceRes.data[0].code)
    }
  }
  useEffect(() => {
    getProvinceList()
  }, [])

  const handleSelect = () => {
    const provineName = provinceList[provinceIndex].name
    const cityListName = cityList[cityIndex].name
    const countryName = countryList[distIndex].name
    const name = provineName + cityListName + countryName
    const data = {
      provinceCode: provinceList[provinceIndex].code,
      cityCode: cityList[cityIndex].code,
      distCode: countryList[distIndex].code,
      name,
    }
    onSelect &&
      onSelect(data, {
        ...data,
        provinceName: provinceList[provinceIndex].name,
        cityName: cityList[cityIndex].name,
        distName: countryList[distIndex].name,
      })
    onClose && onClose()
  }
  return (
    <View className={cx('provinces', visible ? 'provinces--active' : '')}>
      <View
        className={cx('provinces-seat', visible ? 'provinces-seat--active' : '')}
        onClick={() => {
          onClose && onClose()
        }}
      ></View>
      <View className={cx('provinces-container', visible ? 'provinces-container--active' : '')}>
        <View className="provinces-container-top">
          <Text
            className="provinces-container-top-left"
            onClick={() => {
              onClose && onClose()
            }}
          >
            {intl.formatMessage({ id: 'addressPicker_cancel' })}
          </Text>
          <Text className="provinces-container-top-title">{intl.formatMessage({ id: 'addressPicker_title' })}</Text>
          <Text className="provinces-container-top-right" onClick={handleSelect}>
            {intl.formatMessage({ id: 'addressPicker_confirm' })}
          </Text>
        </View>
        <PickerView
          style={{ width: '100%', height: pxTransform(190) }}
          value={[provinceIndex, cityIndex, distIndex]}
          onChange={(e) => handlePickerChange(e.detail.value)}
        >
          <PickerViewColumn key={provinceList?.[0]?.code || '0'}>
            {provinceList?.map((item) => {
              return (
                <View key={`provinceList_${item.code}`} className="provinces-container-select-item">
                  {item.name}
                </View>
              )
            })}
          </PickerViewColumn>
          {cityList.length > 0 && (
            <PickerViewColumn key={cityList[0].code}>
              {cityList?.map((item) => {
                return (
                  <View key={`cityList_${item.code}`} className="provinces-container-select-item">
                    {item.name}
                  </View>
                )
              })}
            </PickerViewColumn>
          )}
          {countryList.length > 0 && (
            <PickerViewColumn key={countryList[0].code}>
              {countryList?.map((item) => {
                return (
                  <View key={`countryList_${item.code}`} className="provinces-container-select-item">
                    {item.name}
                  </View>
                )
              })}
            </PickerViewColumn>
          )}
        </PickerView>
      </View>
    </View>
  )
}
export default Provinces
