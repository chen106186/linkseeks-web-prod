import React from 'react'
import type { ToolItem } from './Tool'
import { useTree } from './context'
import { TrashFillIcon, PlusFillIcon } from '@linkseeks/icons'
import { Button, Popconfirm } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
/**
 * 使用右侧工具栏，默认返回常见的按钮集合
 */
export const useTool = (extraTools: ToolItem[]) => {
  const { menuUtil, setExpandKeys, updateTreeData, handleToolAdd, handleToolDelete, setSelectKeys, setSelectNode } =
    useTree()
  const translate = useWebIntl()

  const tools: ToolItem[] = [
    {
      render(node) {
        return (
          <Button
            type="text"
            onClick={(e) => {
              e.stopPropagation()
              setExpandKeys(node.id, true)
              handleToolAdd && handleToolAdd(node)
              const newNode = menuUtil.addNode(node.id)
              setSelectNode(newNode)
              setSelectKeys([newNode.id])
              updateTreeData()
            }}
            icon={<PlusFillIcon size={16} />}
          ></Button>
        )
      },
    },
    {
      render(node) {
        const handleRemove = (e) => {
          e.stopPropagation()
          handleToolDelete && handleToolDelete(node)
          menuUtil.removeNode(node.id)
          updateTreeData()
        }
        return (
          <Popconfirm title={translate('web.common.quedingshangchu')} onConfirm={handleRemove}>
            <Button type="text" icon={<TrashFillIcon size={16} />}></Button>
          </Popconfirm>
        )
      },
    },
  ]
  tools.push(...extraTools)

  return tools
}
