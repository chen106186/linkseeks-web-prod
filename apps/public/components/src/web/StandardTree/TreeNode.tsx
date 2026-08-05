import React, { Children } from 'react'
import { useTree } from './context'
import { ITreeDataItem } from './MenuUtil'
import { ButtonFillIcon } from '@linkseeks/icons'
import Tool from './Tool'

const TreeNode = ({ node, handleNodeClick, autoHideTools }) => {
  const { renderTools, disableAction } = useTree()

  const renderTool = (node: ITreeDataItem) => {
    if (!renderTools) {
      return null
    }
    return Children.map(renderTools(node), (child, index) => {
      return (
        <Tool autoHideTools={autoHideTools} key={index}>
          {child}
        </Tool>
      )
    })
  }
  return (
    <div className="tree-self-node" onClick={(e) => handleNodeClick(node, e)}>
      {node.isBtn ? (
        <div className="cp-tree-node-btn">
          <ButtonFillIcon size={24} style={{ marginRight: 4, marginLeft: 4 }} />
          <span>{node.name}</span>
        </div>
      ) : (
        <span>{node.name}</span>
      )}

      {!disableAction && renderTool(node)}
    </div>
  )
}

export default TreeNode
