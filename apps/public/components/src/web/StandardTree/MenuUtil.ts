import { Key } from 'react'
import { v4 as uuid } from 'uuid'
import clone from 'clone'
export type TreeId = string | number

export interface ITreeDataItem {
  name: string | React.ReactElement
  title?: string
  id: TreeId
  parentId: TreeId
  children?: ITreeDataItem[]
  /**
   * 是否是最后一个节点
   */
  isLeaf?: boolean

  /**
   * 是否是按钮
   * 特殊需求，只适用于菜单权限场景
   */
  isBtn?: boolean
  [key: string]: any
}

export class MenuUtil {
  treeData: ITreeDataItem[] = []
  hashTreeData: Record<string, ITreeDataItem> = {}
  constructor(data: ITreeDataItem[] = []) {
    this.treeData = this.createTreeData(data)
  }

  createTreeData(data: ITreeDataItem[]) {
    return data.map((treeNode) => {
      if (treeNode.children) {
        treeNode.children = this.createTreeData(treeNode.children)
      }

      return treeNode
    })
  }

  createHashTreeData(data: ITreeDataItem[]) {
    const hashTreeData: any = {}
    const dispatchData = [...data]
    while (dispatchData.length > 0) {
      const item = dispatchData.shift()

      if (item) {
        if (item.children) {
          dispatchData.push(...item.children)
        }
        hashTreeData[item.id] = item
      }
    }

    return hashTreeData
  }

  addRootNode(newNode: ITreeDataItem) {
    // 新增节点时默认让节点可编辑
    this.treeData.push(newNode)
    return newNode
  }

  addNode(id: TreeId, newNode: ITreeDataItem) {
    this.loopTreeData(this.treeData, id, (node, index, treeData) => {
      node.children = node.children || []
      node.children.push(newNode)
    })
    return newNode
  }

  /**
   * 粘贴节点
   */
  pasteNode(id: TreeId, newNode: ITreeDataItem) {
    const add = (target: ITreeDataItem) => {
      const result: ITreeDataItem = clone(target)
      result.id = this.createUuid()
      if (target.children) {
        result.children = target.children.map(add)
      }
      return result
    }

    const _newNode = add(newNode)

    this.loopTreeData(this.treeData, id, (node, index, treeData) => {
      node.children = node.children || []
      node.children.push(_newNode)
    })
  }

  removeNode(id: TreeId) {
    this.loopTreeData(this.treeData, id, (node, index, treeData) => {
      treeData.splice(index, 1)
    })
  }

  // 更新节点信息
  updateNode(id: TreeId, target: Partial<ITreeDataItem>) {
    this.loopTreeData(this.treeData, id, (node, index, treeData) => {
      Object.assign(node, target)
    })
  }

  /**
   * 通过key遍历整个数据
   */

  loopTreeData(
    data: ITreeDataItem[],
    key: Key,
    callback: (node: ITreeDataItem, index: number, data: ITreeDataItem[]) => void,
  ) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === key) {
        return callback(data[i], i, data)
      }
      if (data[i].children) {
        this.loopTreeData(data[i].children!, key, callback)
      }
    }
  }

  /**
   * 交换节点位置，其实是拖拽功能
   */
  switchNode(info: { dragNode: ITreeDataItem; node: ITreeDataItem; dropPosition: number; dropToGap: boolean }) {
    const { dragNode, node: targetNode, dropPosition, dropToGap } = info
    let dragObj: ITreeDataItem

    // 删除拖拽的那个元素
    this.loopTreeData(this.treeData, dragNode.id, (node, index, data) => {
      data.splice(index, 1)
      dragObj = node
    })

    if (!dropToGap) {
      // 向目标节点添加元素，如果是从头部插入
      this.loopTreeData(this.treeData, targetNode.id, (node) => {
        node.children = node.children || []
        node.children.unshift(dragObj)
      })
    } else if ((targetNode.children || []).length > 0 && targetNode.expanded && dropPosition === 1) {
      this.loopTreeData(this.treeData, targetNode.id, (node) => {
        node.children = node.children || []
        node.children.unshift(dragObj)
      })
    } else {
      let arr: ITreeDataItem[] = []

      let i: number
      this.loopTreeData(this.treeData, targetNode.id, (node, index, array) => {
        arr = array
        i = index
      })

      if (dropPosition === -1) {
        arr.splice(i!, 0, dragObj!)
      } else {
        arr.splice(i! + 1, 0, dragObj!)
      }
    }
  }

  /**
   * 获取整个tree数据的key集合
   */
  getTreeDataKeys(treeData: ITreeDataItem[]) {
    const data: ITreeDataItem[] = [...treeData]
    const results: TreeId[] = []
    while (data.length) {
      const item = data.shift()
      results.push(item!.id)
      if (item?.children) {
        data.push(...item.children)
      }
    }

    return results
  }

  /**
   * 获取数据列表的id集合
   */
  getDataKeys(treeData: ITreeDataItem[]) {
    return treeData.map((v) => v.id)
  }
  createUuid() {
    return `$$-${uuid()}`
  }

  // 树形结构降为一维对象处理
  treeReduction(data: any[]) {
    const hashMaps = {}
    const selfData: any[] = clone(data)
    while (selfData.length > 0) {
      const useItem = selfData.shift()

      // 存在子集
      if (useItem.children && useItem.children.length > 0) {
        useItem.children = useItem.children.map((v) => {
          v.parentId = useItem.id
          return v
        })
        selfData.push(...useItem.children)
      }

      hashMaps[useItem.id] = useItem
    }
    return hashMaps
  }
}
