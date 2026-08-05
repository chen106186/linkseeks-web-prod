import { useEffect, useState } from 'react'
import { getManageAreaFindProvinceCity } from '@apps/apis'
import {
  AreaDataItemType,
  CityItemType,
  SearchOption,
  SelectAreaItemType,
  UseAreaDataRes,
} from '@/components/TopBar/SwitchCity/types'

const useAreaData = (): UseAreaDataRes => {
  const [visible, setVisible] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [currentActive, setCurrentActive] = useState<'province' | 'city'>('province')
  const [selectProvince, setSelectProvince] = useState<AreaDataItemType>()
  const [selectCity, setSelectCity] = useState<CityItemType>()
  const [areaData, setAreaData] = useState<AreaDataItemType[]>([])
  const [cityList, setCityList] = useState<CityItemType[]>([])
  const [directlyCityList, setDirectlyCityList] = useState<AreaDataItemType[]>([])
  const [allCityList, setAllCityList] = useState<SelectAreaItemType[]>([])
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([])

  const initAreaData = (list: AreaDataItemType[]): void => {
    if (!list || list.length === 0) return
    const directlyCity: AreaDataItemType[] = []
    const provinceList: AreaDataItemType[] = []
    const options: SelectAreaItemType[] = []

    list.forEach((provinceItem) => {
      if (provinceItem.cityList && provinceItem.cityList.length <= 2) {
        directlyCity.push(provinceItem)
      } else {
        provinceList.push(provinceItem)
      }
      if (provinceItem.cityList && provinceItem.cityList.length > 0) {
        provinceItem.cityList.forEach((cityItem) => {
          options.push({
            provinceCode: provinceItem.provinceCode,
            provinceName: provinceItem.provinceName,
            cityList: provinceItem.cityList,
            cityCode: cityItem.cityCode,
            cityName: cityItem.cityName,
          })
        })
      }
    })
    setDirectlyCityList(directlyCity.sort((a, b) => (Number(b.provinceCode) > Number(a.provinceCode) ? -1 : 1)))
    setAreaData(provinceList.sort((a, b) => (Number(b.provinceCode) > Number(a.provinceCode) ? -1 : 1)))
    setAllCityList(options)
  }

  const fetchAreaData = async () => {
    const res = await getManageAreaFindProvinceCity({}, { useCache: true })
    if (res.code === 1000 && res.data) {
      initAreaData(res.data as AreaDataItemType[])
    }
  }

  useEffect(() => {
    if (searchValue && allCityList.length > 0) {
      const filterList = allCityList.filter((item) => item.cityName.indexOf(searchValue) > -1)
      const searchList = filterList.map((item) => {
        return {
          label: item.cityName,
          value: item.cityCode,
        }
      })
      setSearchOptions(searchList)
    } else {
      setSearchOptions([])
    }
  }, [searchValue])

  useEffect(() => {
    fetchAreaData()
  }, [])

  const dispatchProvince = (provinceInfo: AreaDataItemType | undefined) => {
    if (provinceInfo) {
      setSelectProvince(provinceInfo)
      setCityList(provinceInfo.cityList)
      setCurrentActive('city')
    } else {
      setSelectProvince(undefined)
      setCityList([])
    }
  }

  const dispatchCity = (cityInfo: CityItemType | undefined) => {
    if (cityInfo) {
      setSelectCity(cityInfo)
      setCurrentActive('city')
    } else {
      setSelectCity(undefined)
      setCurrentActive('province')
    }
  }

  const dispatchSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const toggleVisible = () => {
    setVisible(!visible)
    if (!visible) {
      setSearchValue('')
    }
  }

  /**
   *
   * @param selectInfo
   */
  const onSearchSelect = (selectInfo: SearchOption) => {
    const searchItem = allCityList.filter((item) => item.cityCode === selectInfo.value)[0]
    if (searchItem) {
      dispatchProvince({
        provinceCode: searchItem.provinceCode,
        provinceName: searchItem.provinceName,
        cityList: searchItem.cityList || [],
      })
      return {
        provinceCode: searchItem.provinceCode,
        provinceName: searchItem.provinceName,
        cityCode: searchItem.cityCode,
        cityName: searchItem.cityName,
      }
    }
  }

  return {
    visible,
    searchValue,
    currentActive,
    selectProvince,
    selectCity,
    areaData,
    directlyCityList,
    cityList,
    searchOptions,
    dispatchProvince,
    dispatchCity,
    dispatchSearchValue,
    onSearchSelect,
    toggleVisible,
  }
}

export default useAreaData
