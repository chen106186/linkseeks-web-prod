import { Form, FormInstance } from '@linkseeks/ui'

// 商品主图
export const COMMODITY_PIC = 'mainPic'
export const useCommodityPicField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const commodityPicField = Form.useWatch(COMMODITY_PIC, formInstance)

  return commodityPicField
}
