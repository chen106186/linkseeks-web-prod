/*
 * @Author: GHua
 * @Date: 2022-02-15 16:06:03
 * @LastEditTime: 2022-02-15 17:53:45
 * @LastEditors: GHua
 * @Description:
 */
export interface CityItemType {
  cityCode: string
  cityName: string
}

export interface SelectAreaItemType {
  provinceCode: string
  provinceName: string
  cityList?: CityItemType[]
  cityCode: string
  cityName: string
}

export interface AreaDataItemType {
  provinceCode: string
  provinceName: string
  cityList: CityItemType[]
}

export interface SearchOption {
  label: string
  value: string
}

export interface UseAreaDataRes {
  visible: boolean
  searchValue: string
  currentActive: 'province' | 'city'
  selectProvince: AreaDataItemType | undefined
  selectCity: CityItemType | undefined
  areaData: AreaDataItemType[]
  directlyCityList: AreaDataItemType[]
  cityList: CityItemType[]
  searchOptions: SearchOption[]
  dispatchProvince: (provinceInfo: AreaDataItemType | undefined) => void
  dispatchCity: (cityInfo: CityItemType | undefined) => void
  dispatchSearchValue: (value: string) => void
  onSearchSelect: (searchInfo: SearchOption) => SelectAreaItemType | undefined
  toggleVisible: () => void
}
