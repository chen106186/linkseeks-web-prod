export type FieldNamesType = {
  value?: string
  children?: string
}

export const convertDataToEntities = (treeData, fieldNames?: FieldNamesType) => {
  const result = {}
  formatedTreeData(treeData, result, 0, 0, fieldNames)
  return {
    keyEntities: result,
  }
}

const formatedTreeData = (treeData, hash, parentKey, level, fieldNames?: FieldNamesType) => {
  const parentNode = hash[parentKey] || null

  const keyName = fieldNames?.value || 'key'
  const childrenKeyName = fieldNames?.children || 'children'

  treeData.forEach((_item) => {
    hash[_item[keyName]] = {
      ..._item,
      parentNode: parentNode,
      level: level,
    }
    if (_item[childrenKeyName]) {
      formatedTreeData(_item[childrenKeyName], hash, _item[keyName], level + 1, fieldNames)
    }
  })
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
