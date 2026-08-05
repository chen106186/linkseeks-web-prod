import type { Reducer } from 'react'
import React, { useReducer, useEffect } from 'react'
import { Tree } from 'antd'
import TreeNodeTitle from './treeNodeTitle'

type TreeProps = React.ComponentProps<typeof Tree>

type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
export type onSelectParameters = Parameters<TreeProps['onSelect']>
export type onDropStartParameters = Parameters<TreeProps['onDragStart']>

type TreeDataType = {
  title: string
  key: string
  children?: TreeDataType[]
}

interface Iprops extends TreeProps {
  treeData: TreeDataType[]
  onSortEnd?: (treeData: TreeDataType[]) => void
  draggable?: boolean
  onAdd?: (params: { parentKey: string; depth: number }) => void
  onDragEnd?: ({ startNode, endNode }: any) => void
  fieldNames: { title: string; key: string; children: string }
}

interface State {
  selectNode: null | onSelectParameters[1]['node']
  selectedNodesKey: onSelectParameters[0]
  treeData: TreeDataType[]
  dragNode: null
}

interface SelectAction {
  type: 'select'
  payload: {
    selectedKeys: onSelectParameters[0]
    event: onSelectParameters[1]
  }
}

interface SortAction {
  type: 'sort'
  payload: {
    treeData: TreeDataType[]
  }
}

/**
 * 初始化treeData
 */
interface InitTreeData {
  type: 'init'
  payload: {
    treeData: TreeDataType[]
  }
}

type Action = SelectAction | SortAction | InitTreeData

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'select': {
      return {
        ...state,
        selectNode: !action.payload.event.selected ? null : action.payload.event.node,
        selectedNodesKey: action.payload.selectedKeys,
      }
    }
    case 'sort': {
      return {
        ...state,
        treeData: action.payload.treeData,
      }
    }
    case 'init': {
      return {
        ...state,
        treeData: action.payload.treeData,
      }
    }
    default:
      throw new Error()
  }
}

const MaterialTree: React.FC<Iprops> = (props: Iprops) => {
  const { onSelect, onSortEnd, draggable = false, fieldNames } = props

  const [state, dispatch] = useReducer(reducer, {
    selectNode: null,
    selectedNodesKey: [],
    treeData: props.treeData,
    dragNode: null,
  })

  useEffect(() => {
    dispatch({
      type: 'init',
      payload: {
        treeData: props.treeData,
      },
    })
  }, [props.treeData])

  const onAdd = (params: { parentKey: string; depth: number }, e) => {
    e.stopPropagation()
    props.onAdd?.(params)
  }

  const onAddChildNode = (params: { parentKey: string; depth: number }, e) => {
    e.stopPropagation()
    props.onAdd?.(params)
  }

  const actions = {
    onAdd: onAdd,
    onAddChildNode: onAddChildNode,
  }

  const onDrop = (info) => {
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children, key, callback)
        }
      }
    }
    const data = [...state.treeData]

    // Find dragObject
    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
      })
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      })
    } else {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }
    // onSortEnd?.(data)
    console.log(data, onSortEnd)
    dispatch({
      type: 'sort',
      payload: {
        treeData: data,
      },
    })
  }

  const handleSelect = (selectedKeys: onSelectParameters[0], event: onSelectParameters[1]) => {
    console.log('selectedKeys[0] === event.node.key :>> ', selectedKeys[0] === event.node.key)
    if (selectedKeys[0] === event.node.key) {
      onSelect?.(selectedKeys, event)
      dispatch({
        type: 'select',
        payload: {
          selectedKeys,
          event,
        },
      })
    }
  }

  const renderNode = (nodeData) => {
    return (
      <TreeNodeTitle
        title={nodeData[fieldNames?.title || 'title']}
        currentKey={nodeData.id}
        actions={actions}
        parentKey={nodeData.parentId}
      />
    )
  }

  return (
    <Tree
      draggable={draggable}
      // treeData={generateTreeData}
      treeData={state.treeData}
      selectedKeys={state.selectedNodesKey}
      onSelect={handleSelect}
      onDrop={onDrop}
      defaultExpandAll
      blockNode
      fieldNames={fieldNames}
      titleRender={renderNode}
    />
  )
}

export default MaterialTree
