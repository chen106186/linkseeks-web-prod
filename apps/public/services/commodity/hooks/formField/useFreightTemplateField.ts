import { Form, FormInstance } from '@linkseeks/ui'

// 物流 - 使用运费模板
export const IS_TEMPLATE = ['logistics', 'useTemplate']
export const useFreightTemplateField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const freightTemplate = Form.useWatch(IS_TEMPLATE, formInstance)

  return freightTemplate
}
