import { CATEGORY_TYPE } from '@apps/services/commodity'
interface AttrItemOptions {
  /**
   * id
   */
  id: number
  /**
   * 表单项的文本
   */
  label: string
  /**
   * 表单项类型
   */
  type: CATEGORY_TYPE
  /**
   * 是否是规格属性
   */
  isPrice: boolean
  /**
   * 是否必填 true为必填，false为非必填
   */
  isMust: boolean
}

class AttrItemFactory {}

export class AttrItem {
  /**
   * id
   */
  id: number
  /**
   * 表单项的文本
   */
  label: string
  /**
   * 表单项类型
   */
  type: CATEGORY_TYPE
  /**
   * 是否是规格属性
   */
  isSpecs: boolean
  /**
   * 是否必填 true为必填，false为非必填
   */
  isMust: boolean

  constructor(options: AttrItemOptions) {
    this.id = options.id
    this.label = options.label
    this.type = options.type
    // 接口层面这个字段叫做isPrice
    this.isSpecs = options.isPrice
    this.isMust = options.isMust
  }

  /**
   * 外部在取值的时候 实际上取的是id
   */
  getValue() {
    return this.id
  }
}
