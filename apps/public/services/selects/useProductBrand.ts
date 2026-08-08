import { getProductSelectGetSelectBrand } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

/**
 * 获取商品品类下拉列表
 */
export const useProductBrand = () => {
  const { data, loading } = useRequestApi(getProductSelectGetSelectBrand)

  return [data, loading] as any
}
