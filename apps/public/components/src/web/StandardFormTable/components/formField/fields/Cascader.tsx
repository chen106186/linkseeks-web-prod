import React, { useMemo, useState } from 'react'
import { Cascader } from '@linkseeks/ui'
import { find, flatMap } from 'lodash'

function findPathById(tree, targetId, currentPath = [] as any[]) {
  if (tree && Array.isArray(tree)) {
    for (const node of tree) {
      const newPath = [...currentPath, node.value]

      if (node.value === targetId) {
        return newPath
      }

      if (node.children && node.children.length > 0) {
        const result = findPathById(node.children, targetId, newPath)
        if (result) {
          return result
        }
      }
    }
  }
  return null
}
const CascaderField = ({ onChange, value, options, ...resetProps }: any) => {
  const innerValue = useMemo(() => {
    return findPathById(options, value)
  }, [value, options])

  // 仅支持单选模式，选中之后只会返回最后一级的节点id
  const handleChange = (value) => {
    if (value && Array.isArray(value)) {
      const item = [...value].pop()
      onChange(item)
    } else {
      onChange('')
    }
  }

  return <Cascader {...resetProps} options={options} value={innerValue} onChange={handleChange} />
}

export default CascaderField
