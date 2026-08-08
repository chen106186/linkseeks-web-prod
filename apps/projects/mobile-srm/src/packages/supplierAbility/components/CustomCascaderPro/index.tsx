/*
 * @Description: Cascader 额外处理 disabled 组件
 */
import React, { useEffect, useState } from 'react'
import CustomCascader, { CustomCascaderProps } from '../CustomCascader'
import './index.scss'

type DisbledKeysType = React.Key[]

function convertDataToEnhanced(
  treeData: CustomCascaderProps['treeData'],
  disabledKeys: DisbledKeysType,
  fieldNames: CustomCascaderProps['fieldNames'],
): CustomCascaderProps['treeData'] {
  // 跳过检查
  if (!disabledKeys || !disabledKeys.length) {
    return treeData
  }
  const ret: CustomCascaderProps['treeData'] = []
  formatedTreeData(treeData, disabledKeys, ret, fieldNames)
  return ret
}

function formatedTreeData(
  treeData: CustomCascaderProps['treeData'],
  disabledKeys: DisbledKeysType,
  hash: CustomCascaderProps['treeData'],
  fieldNames: CustomCascaderProps['fieldNames'],
) {
  let { value: valueKey, children: childrenKey } = fieldNames || {}
  valueKey = valueKey || 'value'
  childrenKey = childrenKey || 'children'

  treeData.forEach((item) => {
    const entity = {
      ...item,
      disabled: disabledKeys.includes(item[valueKey!]),
      [childrenKey!]: [],
    }
    if (item[childrenKey!]) {
      formatedTreeData(item[childrenKey!], disabledKeys, entity[childrenKey!], fieldNames)
    }
    hash.push(entity)
  })
}

export interface CustomCascaderProProps extends CustomCascaderProps {
  /**
   * 禁用项keys
   */
  disabledKeys?: DisbledKeysType
}

const CustomCascaderPro: React.FC<CustomCascaderProProps> = (props) => {
  const { disabledKeys, treeData, value, ...restProps } = props
  const [internalTreeData, setInternalTreeData] = useState(treeData || [])

  useEffect(() => {
    if ('treeData' in props) {
      if (disabledKeys) {
        // 过滤掉自身value值
        const leftover = disabledKeys?.filter((item) => !value?.includes(item))
        setInternalTreeData(convertDataToEnhanced(treeData, leftover, restProps.fieldNames))
      }
    }
  }, [treeData, disabledKeys, restProps.fieldNames, value])

  return <CustomCascader treeData={internalTreeData} value={value} {...restProps} />
}

export default CustomCascaderPro
