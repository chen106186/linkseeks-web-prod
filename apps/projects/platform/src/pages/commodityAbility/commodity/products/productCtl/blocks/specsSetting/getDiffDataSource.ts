import { isEqual } from 'lodash'

/**
 * 获取规格sku列表与待选择sku列表之间交集的补集
 */
export const getDiffDataSource = (dataSource: any[], specsSettingDataSource: any[]) => {
  return dataSource.filter((v) => {
    if (specsSettingDataSource.length === 0) {
      return true
    }
    return specsSettingDataSource.every((specs) => !isEqual(v.getRowKey(), specs.getRowKey()))
  })
}
