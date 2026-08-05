import { useMap } from '@linkseeks/hooks'
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { TabTreeActions } from '@/components/TabTree'
import { ISchemaFormActions } from '@apps/formily'
import { isObject } from '@/utils'
import { usePageStatus } from './usePageStatus'

export enum FormState {
  FREE, // 空闲状态
  EDIT, // 编辑状态
  ADD, // 新增状态
}

export interface useTreeTabOptions {
  selectCallback?(selectKey?, node?)
  fetchMenuData?(roleId?: number)
  fetchItemDetailData?(id)
  // 重置右侧详情
  resetDetail?()
  // 对树形工具栏做render扩展
  extendsToolsRender?: any
  // 树形的实例操作方法
  treeActions?: TabTreeActions
  // 右侧表单的实例操作方法
  formActions?: ISchemaFormActions
  // 删除菜单时调用的API
  deleteMenu?: any
}

export interface treeNodeResponse {
  /**
   * 该节点是否选中
   */
  selected: boolean

  /**
   * 节点信息
   */
  node: any
}

export const useTreeData = (options: useTreeTabOptions = {}) => {
  const { selectCallback, fetchMenuData, treeActions, formActions, extendsToolsRender, deleteMenu } = options
  const [treeExtraMaps, { set, get }] = useMap<any, any>()
  const [treeData, setTreeData] = useState<any[]>([])
  const [treeStatus, setTreeStatus] = useState<FormState>(FormState.FREE)
  const [nodeRecord, setNodeRecord] = useState<any>(null)

  const [isEditForm, setIsEditForm] = useState<boolean>(false)
  const { id } = usePageStatus()

  useEffect(() => {
    resetMenu()
  }, [])
  const resetMenu = async () => {
    if (fetchMenuData) {
      const res = await fetchMenuData(Number(id))
      setTreeData(res.data || [])
    }
  }

  const handleSelect = (selectKey?, node?) => {
    return new Promise<treeNodeResponse>((resolve, reject) => {
      if (selectCallback) {
        // 完全自定义点击节点事件
        selectCallback(selectKey, node)
        return
      }
      resolve({
        selected: true,
        node: node || null,
      })
    })
  }

  const handleDeleteMenu = (id) => {
    deleteMenu({
      id: isObject(id) ? nodeRecord.key : id,
    }).then(() => {
      setTreeStatus(FormState.FREE)
      setNodeRecord(undefined)
      resetMenu()
    })
  }

  // 新增整合树形操作菜单
  // 树形工具栏
  const toolsRender = {
    addNode(node) {
      const activeParentId = treeActions && treeActions.getParent(node.key || node.id)?.id
      setNodeRecord({
        ...node,
        parentId: activeParentId, // 添加同级的时候 使用上一级的id作为parentId
      })
      formActions && formActions.reset({ validate: false })
      setTreeStatus(FormState.ADD)
    },
    addChildNode(node) {
      setNodeRecord({
        ...node,
        parentId: node.key || node.id,
      })
      formActions && formActions.reset({ validate: false })
      set(node.key || node.id, null)
      setTreeStatus(FormState.ADD)
    },
    deleteNode(node) {
      const id = node.key || node.id
      handleDeleteMenu(id)
    },
    ...extendsToolsRender,
  }

  return {
    handleSelect,
    treeStatus,
    setTreeStatus,
    treeData,
    setTreeData,
    nodeRecord,
    setNodeRecord,
    isEditForm,
    setIsEditForm,
    treeExtraMaps,
    setTreeMaps: set,
    getTreeMaps: get,
    resetMenu,
    toolsRender,
    handleDeleteMenu,
  }
}
