import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
/**
 * 根据 获取商品品类数据
 *
 * 常用于Cascader 级联筛选品类
 */
export const useProductCategoryTree = () => {
  const { data, loading } = useRequestApi(getProductCustomerGetCustomerCategoryTree)

  return [data, loading] as any
}
