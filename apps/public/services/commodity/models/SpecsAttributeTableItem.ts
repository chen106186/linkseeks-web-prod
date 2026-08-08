import { PriceDataModal } from './PriceDispatch'

export class SpecsAttributeTableItem {
  label: string
  value: number
  parentAttributeId: number
  /**
   * 如果是已经存在的数据，则会有id
   */
  id?: number
  constructor({
    label,
    value,
    parentAttributeId,
    id,
  }: {
    label?: string
    value?: number
    parentAttributeId: number
    id?: number
  }) {
    this.label = label || ''
    this.value = value || 0
    this.parentAttributeId = parentAttributeId
    if (id) {
      this.id = id
    }
  }
}

export class SpecsAttributeTableRow {
  id: any
  unitPrice: PriceDataModal
  priceRate: PriceDataModal
  commodityPic: string[]
  materielId: number
  hsCode: string
  code?: string
  name?: string
  constructor() {}

  addResource(key: any, value: any) {
    this[key] = value
  }

  addResources(record: any) {
    Object.assign(this, record)
  }

  getRowKey() {
    // 如果是编辑状态，则会存在id字段，否则用对象下的value来组成id
    return Object.values<any>(this.getSpecsAttribute())
      .map((v) => v.value)
      .join(',')
  }

  getSpecsAttribute() {
    const result: any = {}
    Object.keys(this).forEach((v) => {
      if (!isNaN(Number(v))) {
        // 数字作为属性的是规格属性
        result[v] = this[v]
      }
    })
    return result
  }
  // 额外属性设置
  // 设置商品图片
  setCommodityPic(commodityPic: string[]) {
    this.commodityPic = commodityPic
  }

  setCode(code: string) {
    this.code = code
  }

  setId(id: number) {
    this.id = id
  }

  // 设置关联物料信息
  setMaterielId(materielId: number) {
    this.materielId = materielId
  }

  setHsCode(hsCode: string) {
    this.hsCode = hsCode
  }

  setUnitPrice(unitPrice: PriceDataModal) {
    this.unitPrice = unitPrice
  }

  setProductName(productName: string) {
    this.name = productName
  }
}
