import { getOrderCommonOrderTypes } from '@apps/apis'

export const fetchOrderTypes = async () => {
  const { code, data } = await getOrderCommonOrderTypes()
  if (code !== 1000) {
    return []
  }
  return data
}
