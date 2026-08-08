export interface CurrentCityType {
  cityCode: string
  cityName: string
  provinceCode: string
  provinceName: string
  districtCode?: string
  districtName?: string
  streetCode?: string
  streetName?: string
}

export interface LocationStoreModel {
  /** 当前定位城市信息 */
  currentCity: CurrentCityType | undefined
  /** 更新当前定位城市信息 */
  updateCurrentCity: (cityInfo: CurrentCityType) => void
  /** 获取缓存中选择的城市信息 */
  getCurrentCity: () => void
}
