import type { GetMarketingCouponPlatformWaiteExecuteDetailPageConditionResponse } from '@apps/apis'
import { getMarketingCouponPlatformWaiteExecuteDetailPageCondition } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo, useState, useEffect } from 'react'

const useSelectOptions = (couponId) => {
  const [data, setData] = useState<GetMarketingCouponPlatformWaiteExecuteDetailPageConditionResponse | null>()
  const { run } = useRequestApi(getMarketingCouponPlatformWaiteExecuteDetailPageCondition, {
    manual: true,
    onSuccess({ data: _data }) {
      setData(_data)
    },
  })

  useEffect(() => {
    if (couponId) {
      run({ id: couponId })
    }
  }, [couponId])

  const selectData = useMemo(
    () => ({
      status: data?.statusList?.map((item) => ({ label: item.name, value: item.value })),
      suitableMemberType: data?.suitableMemberTypeList?.map((item) => ({ label: item.name, value: item.value })),
      shopId: data?.shopList?.map((item) => ({ label: item.name, value: item.value })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
