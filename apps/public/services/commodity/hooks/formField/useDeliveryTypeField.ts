import { Form, FormInstance } from '@linkseeks/ui'

// 物流 - 配送方式
export const DELIVERY_TYPE = ['logistics', 'deliveryType']
export const useDeliveryTypeField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const deliveryType = Form.useWatch(DELIVERY_TYPE, formInstance)

  return deliveryType
}
