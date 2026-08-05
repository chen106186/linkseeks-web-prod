import { Form, FormInstance } from '@linkseeks/ui'

// 品牌id
export const BRAND_ID = 'brandId'
export const useBrandIdField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const carriageType = Form.useWatch(BRAND_ID, formInstance)

  return carriageType
}
