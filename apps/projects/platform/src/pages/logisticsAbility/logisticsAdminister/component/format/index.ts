type addressInfo = {
  /** 省编号 */
  provinceCode?: string
  /** 省名称 */
  provinceName?: string
  /** 市编号 */
  cityCode?: string
  /** 市名称 */
  cityName?: string
  /** 区编号 */
  districtCode?: string
  /** 区名称 */
  districtName?: string
  /** 街道编码 */
  streetCode?: string
  /** 街道名称 */
  streetName?: string
}

/** 格式化地址 */
export const area = (areaSelect) => {
  const [province, city, district, street] = areaSelect
  let newObj: addressInfo = {}
  newObj.provinceCode = province.code
  newObj.provinceName = province.name
  newObj.cityCode = city.code
  newObj.cityName = city.name
  newObj.districtCode = district.code
  newObj.districtName = district.name
  street && (newObj.streetCode = street.code)
  street && (newObj.streetName = street.name)
  return newObj
}
