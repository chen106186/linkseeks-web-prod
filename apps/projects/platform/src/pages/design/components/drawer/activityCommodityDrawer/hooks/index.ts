import { useEffect, useState } from 'react'
import { getMarketingMerchantActivityGetActivityTypeList } from '@apps/apis'

const useSelectOptions = () => {
  const [activityTypeOptions, setActivityTypeOptions] = useState<Array<{ label: string; value: number }>>([])

  const fetchActivityTypeList = () => {
    getMarketingMerchantActivityGetActivityTypeList().then((res) => {
      if (res.code === 1000 && res.data) {
        setActivityTypeOptions(
          res.data.map((item) => ({
            label: item.name,
            value: item.status,
          })),
        )
      }
    })
  }

  useEffect(() => {
    fetchActivityTypeList()
  }, [])

  return {
    activityTypeOptions,
  }
}

export default useSelectOptions
