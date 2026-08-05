import React, { useState, useEffect } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
// import { PickerView, PickerViewColumn } from '@tarojs/components'
import { View, Text, PickerView } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { getMemberAreaCity, getMemberAreaDistrict, getMemberAreaProvince } from '@apps/apis'
import './index.scss'

interface AddressPickerProps {
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any, allMap?: any) => void
  // 子元素
  children?: React.ReactChild
}
const Provinces = (props: AddressPickerProps) => {
  const { onClose, onSelect, children } = props
  const [provinceList, setProvinceList] = useState<any>([]) // 省
  const [cityList, setCityList] = useState<any>([]) // 市
  const [countryList, setCountyList] = useState<any>([]) // 区
  const [provinceIndex, setProvinceIndex] = useState(0) //省下标
  const [cityIndex, setCityIndex] = useState(0) // 市下标
  const [distIndex, setDistIndex] = useState(0) // 区下标
  const [columns, setColumns] = useState<any[]>([])
  const [arrValue, setArrValue] = useState<any[]>([])
  const intl = useIntl()

  const _returnColData = (list) => {
    return list.map((item) => ({ label: item.name, value: item.code }))
  }

  /* 监听滚动的值 */
  const handlePickerChange = async (val) => {
    if (provinceIndex !== val[0] && val[0]) {
      setProvinceIndex(val[0])
      const cityRes: any = await getMemberAreaCity({ code: val[0] })
      const distrRes: any = await getMemberAreaDistrict({ code: cityRes.data[0].code })
      batchedUpdates(() => {
        setCityList(_returnColData(cityRes.data))
        setCityIndex(0)
        setCountyList(_returnColData(distrRes.data))
        setDistIndex(0)
      })
    } else {
      if (cityIndex !== val[1] && val[1]) {
        const distrRes: any = await getMemberAreaDistrict({ code: val[1] })
        batchedUpdates(() => {
          setCountyList(_returnColData(distrRes.data))
          setCityIndex(val[1])
          setDistIndex(val[2])
        })
      } else {
        setDistIndex(val[2])
      }
    }
    setArrValue(val)
  }
  /* 获取区 */
  const getAreaDistrict = async (code: string) => {
    const distrRes: any = await getMemberAreaDistrict({ code })
    await setCountyList(_returnColData(distrRes.data))
    setArrValue([provinceList[0]?.value, cityList[0]?.value, countryList[0]?.value])
  }
  /* 获取市 */
  const getAreaCity = async (code: string) => {
    const cityRes: any = await getMemberAreaCity({ code })
    if (cityRes.code === 1000) {
      await setCityList(_returnColData(cityRes.data))
      await getAreaDistrict(cityRes.data[0].code)
    }
  }
  /* 获取省 */
  const getProvinceList = async () => {
    const provinceRes: any = await getMemberAreaProvince()
    if (provinceRes.code === 1000) {
      await setProvinceList(_returnColData(provinceRes.data))
      // await getAreaCity(provinceRes.data[0].code)
    }
  }
  useEffect(() => {
    getProvinceList()
  }, [])

  useEffect(() => {
    const _list: any = []
    if (provinceList?.length > 0) {
      _list.push(provinceList)
    }
    if (cityList?.length > 0) {
      _list.push(cityList)
    }
    if (countryList?.length > 0) {
      _list.push(countryList)
    }
    setColumns(_list)
  }, [provinceList, cityList, countryList])

  const handleSelect = () => {
    const _province = provinceList?.find((item) => item.value === provinceIndex)
    const _city = cityList?.find((item) => item.value === cityIndex)
    const _country = countryList?.find((item) => item.value === distIndex)
    const name = _province?.label + _city?.label + _country?.label
    const data = {
      provinceCode: _province.value,
      cityCode: _city.value,
      distCode: _country.value,
      name,
    }
    onSelect &&
      onSelect(data, {
        ...data,
        provinceName: _province.label,
        cityName: _city.label,
        distName: _country.label,
      })
    onClose && onClose()
  }
  return (
    <PickerView
      cancelText={intl.formatMessage({ id: 'addressPicker_cancel' })}
      submitText={intl.formatMessage({ id: 'addressPicker_confirm' })}
      title={intl.formatMessage({ id: 'addressPicker_title' })}
      columns={columns}
      value={arrValue}
      onConfirm={handleSelect}
      onChange={(val) => {
        handlePickerChange(val)
      }}
    >
      {children}
    </PickerView>
  )
}
export default Provinces
