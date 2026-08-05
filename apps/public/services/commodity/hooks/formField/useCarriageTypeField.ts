import { Form, FormInstance } from '@linkseeks/ui'

// 物流 - 运费方式
export const CARRIAGE_TYPE = ['logistics', 'carriageType']
export const useCarriageTypeField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const carriageType = Form.useWatch(CARRIAGE_TYPE, formInstance)

  return carriageType
}
