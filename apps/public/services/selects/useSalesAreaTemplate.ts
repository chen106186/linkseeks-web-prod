import { getProductCommoditySalesAreaTemplateList } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

/**
 * 获取销售区域模板下拉列表
 */
export const useSalesAreaTemplate = () => {
  const { data, loading } = useRequestApi(getProductCommoditySalesAreaTemplateList, {
    defaultParams: [
      {
        current: '1',
        pageSize: '100',
      },
    ],
  })

  return [data?.data || [], loading] as any
}
