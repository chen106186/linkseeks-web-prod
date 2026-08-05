import { FormInstance } from '@linkseeks/ui'
import { code2AreaList } from '../utils'

export const AREA_SELECT_NAME = 'NOT_CHANGE_AREA_SELECT_FIELD'

/**
 * 请配合AreaSelectFormItem使用
 */
export const useAreaSelect = (formInstance: FormInstance) => {
  /**
   * 重置区域下拉框
   */
  const initAreaSelect = (value: any) => {
    formInstance.setFieldValue(AREA_SELECT_NAME, code2AreaList(value))
  }
  return {
    initAreaSelect,
  }
}
