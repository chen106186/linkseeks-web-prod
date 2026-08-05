import { Form, FormInstance } from '@linkseeks/ui'

// 基本信息 - 商品品类
export const CUSTOMER_CATEGORY_ID = 'customerCategoryId'
export const useCustomerCategoryIdField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const customerCategoryId = Form.useWatch(CUSTOMER_CATEGORY_ID, formInstance)

  return customerCategoryId
}
