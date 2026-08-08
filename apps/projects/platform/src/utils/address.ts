/**
 * 地址格式化
 */
export const hasAddressCase = (value) => {
  const address = `${value?.consignee}/${value?.countryCode}${value?.phone}\n${value?.areaName}${value?.address}`
  return address
}
