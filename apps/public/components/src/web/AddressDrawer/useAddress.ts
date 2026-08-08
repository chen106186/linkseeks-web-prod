import { getLogisticsSelectListShipperAddress } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

export const useAddress = () => {
  const { data, loading } = useRequestApi(getLogisticsSelectListShipperAddress, {
    cacheKey: 'address',
    cacheTime: 3000,
  })

  return {
    addressList: data,
    loading,
  }
}
