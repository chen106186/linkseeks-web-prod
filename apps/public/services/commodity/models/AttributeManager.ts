import { AttributeGroupType, AttributeModel, AttributeModelOption } from './AttributeModel'

export class AttributeManager {
  private attributes: AttributeModel[]

  constructor() {
    this.attributes = []
  }

  initAttribute(attributeList: AttributeModel[]) {
    this.attributes = attributeList
  }

  findAttributeById(id: number) {
    return this.attributes.find((v) => v.id === id) || null
  }

  // 添加属性模型实例
  addAttribute(attr: AttributeModel) {
    this.attributes.push(attr)
  }

  // 获取所有属性
  getAllAttribute() {
    return this.attributes
  }

  // 获取所有类目属性
  getAllCategoryAttribute() {
    return this.attributes.filter((v) => v.type === AttributeGroupType.CATEGORY)
  }

  // 获取所有规格属性
  getAllSpecsAttribute() {
    return this.attributes.filter((v) => v.type === AttributeGroupType.SPECS)
  }

  // 获取所有非空属性值
  getAllNonEmptyValues() {
    return this.attributes.map((attr) => attr.getValue()).filter((value) => value !== '')
  }

  // 设置属性状态
  setAttributeState(targetId: number, attributeOption: Partial<AttributeModelOption>) {
    const result = this.attributes.find((v) => v.id === targetId)
    if (result) {
      Object.assign(result, attributeOption)
    } else {
      throw `未找到属性id -> ${targetId}`
    }
  }

  // 校验方法

  // 校验所有必填项是否都有值
  validateAllRequired() {
    return this.attributes.filter((v) => v.required).every((v) => !!v.value)
  }
}
