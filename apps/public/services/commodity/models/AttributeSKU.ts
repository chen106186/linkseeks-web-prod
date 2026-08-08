import { cartesianProduct } from '../utils'
import { AttributeModel } from './AttributeModel'
import { SpecsAttributeTableItem, SpecsAttributeTableRow } from './SpecsAttributeTableItem'

export class AttributeSKU {
  attributeModels: AttributeModel[]
  constructor(attributeModels: AttributeModel[]) {
    this.attributeModels = attributeModels
  }

  /**
   * 根据model生成对应的sku数据，注意这里生成的是dataSource
   */
  generateSKUData() {
    const valueCombinations = cartesianProduct(this.attributeModels.map((v) => v.selectedOptions))

    const skus = valueCombinations.map((v) => {
      const sku = new SpecsAttributeTableRow()
      this.attributeModels.forEach((attributeModel, index) => {
        if (attributeModel.id) {
          sku.addResource(
            attributeModel.id,
            new SpecsAttributeTableItem({
              label: v[index].label,
              value: v[index].value,
              parentAttributeId: attributeModel.id,
            }),
          )
        }
      })

      return sku
    })

    return skus
  }

  generateSKUColumns(isCell: Boolean) {
    return this.attributeModels.map((attributeModel) => {
      return {
        width: 200,
        dataIndex: [attributeModel.id, 'label'],
        title: attributeModel.name,
        filters: attributeModel.selectedOptions || [],
        onCell: isCell
          ? function (record, index) {
              return {
                options: attributeModel.selectedOptions,
                editable: true,
                index,
                dataIndex: attributeModel.id,
                record,
              }
            }
          : undefined,
      }
    })
  }

  getSKUAttributeIds() {
    return this.attributeModels.map((v) => v.id).filter(Boolean) as number[]
  }
}
