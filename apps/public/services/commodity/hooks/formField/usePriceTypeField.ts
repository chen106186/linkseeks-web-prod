import { Form, FormInstance } from '@linkseeks/ui'

export const PRICE_TYPE = 'priceType'

// 商品设置 - 商品定价
export const usePriceTypeField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const priceType = Form.useWatch(PRICE_TYPE, formInstance)

  return priceType
}
