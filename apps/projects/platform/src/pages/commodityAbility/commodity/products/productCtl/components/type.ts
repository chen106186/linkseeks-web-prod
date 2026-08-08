export interface AttrFormItem {
  id: string
  name: string
  isMust: boolean
  // 是否是规格属性
  isPrice: boolean
  required: boolean
}

export interface InputAttrFormItem extends AttrFormItem {}
export interface SelectAttrFormItem extends AttrFormItem {
  options: { label: string; value: any; id: any }[]
  // 新增属性弹窗
  attrModalRef: any
  type: CATEGORY_TYPE
}

// ************** SKU ******************
export enum CATEGORY_TYPE {
  /**
   * 单选
   */
  SINGLE = 1,
  /**
   * 多选
   */
  MULTIPLE = 2,
  /**
   * 输入
   */
  INPUT = 3,
}

// sku属性组件
export interface ProductAttrComponentProp extends AttrFormItem {
  /**
   * 品类类型
   */
  type: CATEGORY_TYPE

  /**
   * 表单项
   */
  name: string
  /**
   * 如果是单选/多选情况下，该字段表示对应的options项
   */
  customerAttributeValueList?: any[]
}
