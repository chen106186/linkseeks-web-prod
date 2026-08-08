import { Form, FormInstance } from '@linkseeks/ui'

export const COMMODITY_TYPE = 'type'

// 商品定价枚举
export enum COMMODITY_TYPE_ENUM {
  /**
   * 自营商品
   */
  SELF = 1,
  /**
   * 上游供应商品
   */
  SUPPER_MEMBER = 2,
}

// 商品设置 - 商品类型
export const useTypeField = (form?: FormInstance) => {
  const formInstance = form || Form.useFormInstance()
  const commodityType = Form.useWatch(COMMODITY_TYPE, formInstance)

  return commodityType
}
