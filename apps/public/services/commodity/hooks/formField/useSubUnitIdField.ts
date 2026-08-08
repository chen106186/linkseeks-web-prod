import { Form, FormInstance } from '@linkseeks/ui'

// 副单位
export const SUB_UNIT_ID = 'subUnitId'
export const useSubUnitIdField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const subUnitId = Form.useWatch(SUB_UNIT_ID, formInstance)

  return subUnitId
}
