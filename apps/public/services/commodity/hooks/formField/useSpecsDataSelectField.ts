import { Form, FormInstance } from '@linkseeks/ui'
import { SPECS_ATTR_NAME_PREFIX } from '../../constants'

// 商品属性-规格属性变化
export const useSpecsDataSelectField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const specsDataSelect = Form.useWatch(SPECS_ATTR_NAME_PREFIX, formInstance)

  return specsDataSelect
}
