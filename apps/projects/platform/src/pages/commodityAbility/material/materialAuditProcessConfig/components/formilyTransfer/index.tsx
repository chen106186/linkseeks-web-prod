import { Transfer, Tree } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

interface Iprops {
  dataSource: any[]
  targetKeys: string[]
  value: string[]
  props: {
    enum: any[]
  }
  mutators: {
    change: (data: string[]) => void
  }
}
/**
 * 将tree 转为双向链表
 */
const traverseToDataNode = (treeData, depth, result) => {
  for (let i = 0; i < treeData.length; i++) {
    const current = treeData[i]
    const children = current.children || []
    result[current.id] = {
      ...current,
      depth: depth,
      parent: result[current.parentId] || null,
    }
    if (children.length > 0) {
      traverseToDataNode(children, depth + 1, result)
    }
  }
}

const FormilyTransfer: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators, ...restProps } = props
  const dataSource = props.props?.enum || []

  const treeNodes = useMemo(() => {
    let treeMap = {}
    traverseToDataNode(dataSource, 0, treeMap)
    return treeMap
  }, [dataSource])

  /** 分层 */
  const levelSet = useMemo(() => {
    const map = new Map()
    let maxLevel = 0
    const keys = Object.keys(treeNodes)
    keys.forEach((_item) => {
      const { depth, children } = treeNodes[_item]
      const currentLevel = map.get(depth) || []
      maxLevel = Math.max(maxLevel, depth)
      map.set(depth, currentLevel.concat(treeNodes[_item]))
    })
    return { maxLevel, levelMap: map }
  }, [treeNodes])

  const transferDataSource = []
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push({ ...item, key: item.id })
      flatten(item.children)
    })
  }
  flatten(dataSource)

  const generateTree = (treeNodes = [], checkedKeys = [], parentKey = '', depth = 0) => {
    return treeNodes.map(({ children, ...props }) => {
      const { checked, ...rest } = props
      const result = {
        ...rest,
        key: `${props.id}`,
        title: props.title,
        fullKey: `${parentKey}${props.id}`,
        disabled: checkedKeys.includes(props.id),
        children: generateTree(children, checkedKeys, `${parentKey}${props.id}-`, depth++),
      }
      return result
    })
  }

  const onChange = (datas) => {
    mutators.change(datas)
  }

  const onChecked = (checkedKeys, info) => {
    const { checked, node } = info
    const newCheckedKeys = checked ? [...checkedKeys, node.id] : [node.id]

    // 从上到下， 联动勾选
    for (let i = 0; i < levelSet.maxLevel; i++) {
      const entities = levelSet.levelMap.get(i)

      entities.forEach((entity) => {
        const { id, node, children = [] } = entity

        if (newCheckedKeys.includes(id)) {
          children.forEach((childEntity) => {
            newCheckedKeys.push(childEntity.id)
          })
        }
      })
    }

    if (checked) {
      // 从下而上，联动勾选
      const visitedKeys = new Set()
      for (let level = levelSet.maxLevel; level >= 0; level -= 1) {
        const entities = levelSet.levelMap.get(level) || new Set()
        entities.forEach((entity) => {
          const { parent, node } = entity

          if (!entity.parent || visitedKeys.has(entity.parent.id)) {
            return
          }

          let allChecked = true

          ;(parent.children || []).forEach(({ id }) => {
            const checked = newCheckedKeys.includes(id)
            if (allChecked && !checked) {
              allChecked = false
            }
          })

          if (allChecked) {
            newCheckedKeys.push(parent.id)
          }

          visitedKeys.add(parent.key)
        })
      }
    } else {
      // 有向图， 维护队列一直向上找他的父亲节点
      const queue = [...newCheckedKeys]
      const parentSet = new Set()
      while (queue.length > 0) {
        const item = queue.pop()
        if (parentSet.has(item)) {
          continue
        }

        const current = treeNodes[item]
        if (current) {
          parentSet.add(current.id)
          queue.push(current.parentId)
          newCheckedKeys.push(current.parentId)
        }
      }
    }

    return Array.from(new Set(newCheckedKeys))
  }

  return (
    <Transfer
      {...restProps}
      targetKeys={value}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title}
      showSelectAll={false}
      onChange={onChange}
    >
      {({ direction, onItemSelect, selectedKeys, onItemSelectAll }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...value]
          const treeData = generateTree(dataSource, value || [])
          return (
            <Tree
              blockNode
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={treeData}
              fieldNames={{ title: 'name' }}
              onCheck={(checkedKeysValue, e) => {
                const isChecked = e.checked
                const newData = onChecked(checkedKeys, e)

                onItemSelectAll(newData, isChecked)
              }}
            />
          )
        }
      }}
    </Transfer>
  )
}

FormilyTransfer.isFieldComponent = true

export default FormilyTransfer
