import { Form, FormInstance } from '@linkseeks/ui'

// 价格 - 是否跨境商品
export const IS_CROSS_BORDER = 'isCrossBorder'
export const useIsCrossBorderField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const isCrossBorder = Form.useWatch(IS_CROSS_BORDER, formInstance)

  return isCrossBorder
}
