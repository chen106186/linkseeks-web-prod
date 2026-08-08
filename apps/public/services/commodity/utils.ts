import { SPECS_ATTR_NAME_PREFIX } from './constants'
import { FormInstance } from '@linkseeks/ui'

export const validateSpecsAttr = async (formInstance: FormInstance, isValidate = true) => {
  // 所有规格属性的key名
  const nameList: string[][] = []
  const specsAttrValue = formInstance.getFieldsValue()?.[SPECS_ATTR_NAME_PREFIX]
  if (!specsAttrValue) {
    return null
  }
  Object.keys(specsAttrValue).forEach((key) => {
    nameList.push([SPECS_ATTR_NAME_PREFIX, key])
  })

  if (isValidate) {
    const result = await formInstance.validateFields(nameList)
    return result[SPECS_ATTR_NAME_PREFIX]
  } else {
    const result = formInstance.getFieldsValue()
    return result[SPECS_ATTR_NAME_PREFIX]
  }
}

// 辅助函数，用于计算多个数组的笛卡尔积
export function cartesianProduct(arrays: any[]): any[] {
  return arrays.reduce(
    (accumulator, currentValue) =>
      accumulator
        .map((a: any) => currentValue.map((c: any) => a.concat([c])))
        .reduce((a: any, b: any) => a.concat(b), []),
    [[]],
  )
}
