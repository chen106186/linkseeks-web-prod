import { getProductSelectGetSelectUnit } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

/**
 * 获取计量单位
 */
export const useCNUnit = () => {
  const { data, loading } = useRequestApi(getProductSelectGetSelectUnit)

  return [data, loading] as any
}
