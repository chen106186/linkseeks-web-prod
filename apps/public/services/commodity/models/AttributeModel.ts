export enum AttributeDisplayType {
  SINGLE = 1,
  MULTIPLE = 2,
  TEXT = 3,
}

export enum AttributeGroupType {
  /**
   * 类目属性
   */
  CATEGORY = 1,

  /**
   * 规格属性
   */
  SPECS = 2,
}
export interface AttributeOption {
  label: string
  value: any
  id?: number
}

export interface AttributeModelOption {
  name: string
  type: AttributeDisplayType
  customerAttributeValueList: {
    id: number
    value: string
  }[]
  value?: any
  // 新增时可能是没有id的
  id?: number
  [key: string]: any
}
export class AttributeModel {
  name: string
  displayType: AttributeDisplayType
  type: AttributeGroupType
  value?: any
  // 新增时可能是没有id的
  id?: number
  options?: AttributeOption[]
  /**
   * 已经选中的下拉框项，注意这里和options是互斥的
   */
  selectedOptions?: AttributeOption[]
  // 是否必填
  required?: boolean
  extraProps?: any

  constructor(options: AttributeModelOption) {
    const { name, value, id, type: displayType, customerAttributeValueList, ...extraProps } = options
    this.name = name
    this.value = value
    this.id = id
    this.displayType = displayType
    this.required = extraProps.isMust
    if (extraProps.isPrice) {
      // 是规格属性
      this.type = AttributeGroupType.SPECS
    } else {
      // 是类目属性
      this.type = AttributeGroupType.CATEGORY
    }

    // 初始化选项，如果有的话
    if (customerAttributeValueList) {
      this.options = customerAttributeValueList.map((v) => ({
        label: v.value,
        value: v.id,
        id: v.id,
      }))
    }
    this.extraProps = extraProps
  }

  // 获取属性值，如果有值则返回，否则返回空字符串
  getValue() {
    return this.value !== undefined && this.value !== null ? this.value : ''
  }

  // 设置当前选中的项
  setSelectedOptions(selectedOptions: AttributeOption[]) {
    this.selectedOptions = selectedOptions
  }

  setSelectedOptionsByIds(selectedIds: number[]) {
    this.selectedOptions = selectedIds
      .map((v) => {
        if (this.options) {
          return this.options.find((ops) => ops.id === v)
        }
      })
      .filter(Boolean) as any
  }
}
