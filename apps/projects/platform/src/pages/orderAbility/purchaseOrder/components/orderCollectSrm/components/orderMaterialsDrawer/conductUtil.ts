export const convertDataToEntities = (treeData) => {
  const result = {}
  formatedTreeData(treeData, result, 0, 0)
  return {
    keyEntities: result,
  }
}

const formatedTreeData = (treeData, hash, parentKey, level) => {
  const parentNode = hash[parentKey] || null

  treeData.forEach((_item) => {
    hash[_item.key] = {
      ..._item,
      parentNode: parentNode,
      level: level,
    }
    if (_item.children) {
      formatedTreeData(_item.children, hash, _item.key, level + 1)
    }
  })
}

function removeFromCheckedKeys(halfCheckedKeys, checkedKeys) {
  const filteredKeys = new Set()
  halfCheckedKeys.forEach((key) => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key)
    }
  })
  return filteredKeys
}

export const getLevelEntities = (keyEntities) => {
  let maxLevel = 0

  const levelMap = {}

  Object.keys(keyEntities).forEach((_item) => {
    const current = keyEntities[_item]
    const { level } = current
    maxLevel = Math.max(maxLevel, level)

    if (typeof levelMap[level] === 'undefined') {
      levelMap[level] = []
    }
    levelMap[level].push(current)
  })

  return { levelMap, maxLevel }
}

export const fillConductCheck = (keys, levelEntities, maxLevel) => {
  const checkedKeys = new Set(keys)
  const halfCheckedKeys = new Set()

  // 从上而下 勾选
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities[level] || new Set()
    entities.forEach((entity) => {
      const { key, children = [] } = entity

      if (checkedKeys.has(key)) {
        children.forEach((childEntity) => {
          checkedKeys.add(childEntity.key)
        })
      }
    })
  }

  const visitedKeys = new Set()
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities[level] || new Set()
    entities.forEach((entity) => {
      const { parentNode, node } = entity

      // Skip if no need to check
      if (!entity.parentNode || visitedKeys.has(entity.parentNode.key)) {
        return
      }

      let allChecked = true
      let partialChecked = false

      ;(parentNode.children || []).forEach(({ key }) => {
        const checked = checkedKeys.has(key)
        if (allChecked && !checked) {
          allChecked = false
        }
        if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
          partialChecked = true
        }
      })

      if (allChecked) {
        checkedKeys.add(parentNode.key)
      }
      if (partialChecked) {
        halfCheckedKeys.add(parentNode.key)
      }

      visitedKeys.add(parentNode.key)
    })
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  }
}

// Remove useless key
export const cleanConductCheck = (keys, halfKeys, levelEntities, maxLevel: number) => {
  const checkedKeys = new Set(keys)
  let halfCheckedKeys = new Set(halfKeys)

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities[level] || new Set()
    entities.forEach((entity) => {
      const { key, node, children = [] } = entity

      if (!checkedKeys.has(key) && !halfCheckedKeys.has(key)) {
        children.forEach((childEntity) => {
          checkedKeys.delete(childEntity.key)
        })
      }
    })
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set()
  const visitedKeys = new Set()
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities[level] || new Set()

    entities.forEach((entity) => {
      const { parentNode, node } = entity

      // Skip if no need to check
      if (!entity.parentNode || visitedKeys.has(entity.parentNode.key)) {
        return
      }

      let allChecked = true
      let partialChecked = false

      ;(parentNode.children || []).forEach(({ key }) => {
        const checked = checkedKeys.has(key)
        if (allChecked && !checked) {
          allChecked = false
        }
        if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
          partialChecked = true
        }
      })

      if (!allChecked) {
        checkedKeys.delete(parentNode.key)
      }
      if (partialChecked) {
        halfCheckedKeys.add(parentNode.key)
      }

      visitedKeys.add(parentNode.key)
    })
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  }
}
