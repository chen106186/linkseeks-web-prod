// 约定SKU属性名的前缀，用于获取和写入值
// 类目属性前缀
export const CATEGORY_ATTR_NAME_PREFIX = 'CATEGORY_ATTR_NAME_PREFIX'

// 类目属性文本回显
export const CATEGORY_ATTR_NAME_TEXT_PREFIX = 'CATEGORY_ATTR_NAME_TEXT_PREFIX'
// 规格属性前缀
export const SPECS_ATTR_NAME_PREFIX = 'SPECS_ATTR_NAME_PREFIX'

// 规格属性文本详情回显
export const SPECS_ATTR_NAME_TEXT_PREFIX = 'SPECS_ATTR_NAME_TEXT_PREFIX'

// 规格设置中的 表单项
export const SPECS_SETTING_FORM_NAME = 'SPECS_SETTING_FORM_NAME'

// 进行sku筛选使用的
export enum ATTR_FORM_ITEM_TYPE {
  /**
   * 单选
   */
  SINGLE = 'SINGLE',
  /**
   * 多选
   */
  MULTIPLE = 'MULTIPLE',
  /**
   * 输入
   */
  INPUT = 'INPUT',
}
