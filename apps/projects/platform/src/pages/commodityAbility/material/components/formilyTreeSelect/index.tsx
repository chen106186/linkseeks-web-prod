import React from 'react'
import { TreeSelect } from 'antd'

const { TreeNode } = TreeSelect

interface Iprops {
  props: {
    enum: any[]
    ['x-component-props']: {
      currentId: number
    }
  }
  value: string
  mutators: {
    change: (params: any) => void
    remove: (index: number) => void
  }
}

const FormilyTreeSelect: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { mutators, value } = props
  const options = props.props.enum || []
  const xComponentProps = props.props['x-component-props']

  const onChange = (value) => {
    mutators.change(value)
  }

  const subTreeNode = (subTree) => {
    return subTree.map((_item) => {
      if (_item.id === xComponentProps.currentId) {
        return subTreeNode(_item.children)
      }
      return (
        <TreeNode value={_item.id} title={_item.name} key={_item.id}>
          {subTreeNode(_item.children)}
        </TreeNode>
      )
    })
  }

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Please select"
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
      value={value}
    >
      {subTreeNode(options)}
    </TreeSelect>
  )
}

FormilyTreeSelect.isFieldComponent = true

export default FormilyTreeSelect
