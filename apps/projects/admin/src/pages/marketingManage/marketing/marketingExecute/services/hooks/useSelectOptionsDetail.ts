import { getCommodityWebShopWebAll } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { message } from 'antd'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getCommodityWebShopWebAll, {
    defaultParams: [{ type: 1 }],
    ctlType: 'none',
  })
  message.destroy()

  const selectData = useMemo(
    () => ({
      shopId: data?.map((item) => ({ label: item.name, value: item.id })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
