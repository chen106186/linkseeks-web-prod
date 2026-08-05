import { getOrderPlatformManagePageItems, GetOrderPlatformManagePageItemsResponse } from '@apps/apis'
import { useEffect, useState } from 'react'

/** （订单查询页面）获取前端页面下拉框列表 */
export const getOrderSelectOption = () => {
  const [state, setstate] = useState<GetOrderPlatformManagePageItemsResponse>()

  useEffect(() => {
    getOrderPlatformManagePageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}
