import { getCommodityCountryAreaGetCountryAreaSelectList } from '@apps/apis'

const fetchCountryCode = async () => {
  const { data } = await getCommodityCountryAreaGetCountryAreaSelectList()
  return data?.map((v) => ({
    label: v.name,
    value: v.code,
  }))
}

/**
 * 专门给formily用的获取国家地区编码下拉列表
 * 传入外部的useAsyncSelect函数即可
 * 放在formily的effect中
 */
export const getCountryCodeList = async (dispatchAction: any) => {
  return dispatchAction('countryCode', fetchCountryCode)
}
