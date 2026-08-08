import { Form, FormInstance } from '@linkseeks/ui'

// 商品图片 - 是否所有属性共用图片
// 这里如果是true则是共用，如果是false就是按属性分别配置图片了
export const IS_ALL_ATTRIBUTE_PIC = 'isAllAttributePic'
export const useIsAllAttributePicField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const isAllAttributePic = Form.useWatch(IS_ALL_ATTRIBUTE_PIC, formInstance)

  return isAllAttributePic
}
