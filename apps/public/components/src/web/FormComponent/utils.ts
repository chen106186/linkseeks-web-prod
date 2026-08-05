/**
 * 将组件所选出的地区code，转换成对应的省市区字段编码对象
 */
export const areaList2Code = (areaList: string[], flatAreaMap: any) => {
  const province = areaList[0]
  const city = areaList[1]
  const district = areaList[2]
  const street = areaList[3]
  const results = {
    provinceCode: province,
    provinceName: flatAreaMap[province]?.name,
    cityCode: city,
    cityName: flatAreaMap[city]?.name,
    districtCode: district,
    districtName: flatAreaMap[district]?.name,
    streetCode: street,
    streetName: flatAreaMap[street]?.name,
  }
  return results
}

/**
 * 将组件的省市区编码对象，转换成前端组件可识别的数组形式
 */
export const code2AreaList = (results: any) => {
  const target: string[] = []
  if (results.provinceCode) {
    target[0] = results.provinceCode
  }
  if (results.cityCode) {
    target[1] = results.cityCode
  }
  if (results.districtCode) {
    target[2] = results.districtCode
  }
  if (results.streetCode) {
    target[3] = results.streetCode
  }
  return target
}
