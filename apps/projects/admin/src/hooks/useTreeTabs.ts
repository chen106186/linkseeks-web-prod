import { useMap } from '@linkseeks/hooks'
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { TabTreeActions } from '@/components/TabTree'
import { ISchemaFormActions } from '@apps/formily'
import { isObject } from '@/utils'

export enum FormState {
  FREE, // 空闲状态
  EDIT, // 编辑状态
  ADD, // 新增状态
}

export interface useTreeTabOptions {
  selectCallback?(selectKey?, node?)
  fetchMenuData?()
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

  menuDataKey?: string
  // 组件key
  customKey?: string

  effect?: any
}

export const useTreeTabs = (options: useTreeTabOptions = {}) => {
  const {
    selectCallback,
    fetchMenuData,
    fetchItemDetailData,
    resetDetail,
    treeActions,
    formActions,
    extendsToolsRender,
    deleteMenu,
    menuDataKey,
    customKey,
    effect,
  } = options
  const [treeExtraMaps, { set, get }] = useMap<any, any>()
  const [treeData, setTreeData] = useState<any[]>([])
  const [treeStatus, setTreeStatus] = useState<FormState>(FormState.FREE)
  // @补充一个状态 处理测试提出的 需要区分新增状态下是否新增子集 目前仅新增品类那使用
  const [isAddChild, setIsAddChild] = useState<boolean>(false)
  const [nodeRecord, setNodeRecord] = useState<any>(null)

  const [isEditForm, setIsEditForm] = useState<boolean>(false)

  useEffect(
    () => {
      resetMenu()
    },
    effect ? [effect] : [],
  )

  const resetMenu = async () => {
    if (fetchMenuData) {
      const res = await fetchMenuData()
      setTreeData(menuDataKey ? res.data[menuDataKey] : res.data || [])
    }
  }

  const handleSelect = (selectKey?, node?) => {
    if (selectCallback) {
      selectCallback(selectKey, node)
      return
    }

    // 首次新增菜单的时候没有节点信息
    if (!node) {
      setNodeRecord(null)
      setTreeStatus(FormState.ADD)
      return
    }
    // key相等时 不刷新右侧表单
    if (nodeRecord && nodeRecord.key === selectKey) {
      setNodeRecord(node)
      setTreeStatus(FormState.EDIT)
      setIsAddChild(false)
    } else {
      if (isEditForm) {
        // 有填写过表单
        return new Promise((resolve, reject) => {
          Modal.confirm({
            content: '确认要离开当前页面吗,您提交的数据尚未保存',
            onOk() {
              // 确认离开当前页, 需改变node state
              setNodeRecord(node)
              setTreeStatus(FormState.EDIT)
              setIsAddChild(false)
              // 点击菜单，请求数据重置
              handleFindDetail(selectKey)
              setIsEditForm(false)
              resetDetail && resetDetail()
              resolve(true)
            },
            onCancel() {
              reject()
            },
          })
        })
      } else {
        // 编辑页， 需回显
        handleFindDetail(selectKey)
        setNodeRecord(node)
        setTreeStatus(FormState.EDIT)
        setIsAddChild(false)
      }
    }
  }

  const handleFindDetail = (id) => {
    fetchItemDetailData &&
      fetchItemDetailData({ id }).then((res) => {
        const { data } = res
        set(id, data)
      })
  }

  const handleDeleteMenu = (id) => {
    deleteMenu({
      [customKey || 'id']: isObject(id) ? nodeRecord.key : id,
    }).then(() => {
      setTreeStatus(FormState.FREE)
      setIsAddChild(false)
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
      setIsAddChild(false)
    },
    addChildNode(node) {
      setNodeRecord({
        ...node,
        parentId: node.key || node.id,
      })
      formActions && formActions.reset({ validate: false })
      set(node.key || node.id, null)
      setTreeStatus(FormState.ADD)
      setIsAddChild(true)
    },
    deleteNode(node) {
      const id = node.key || node.id
      handleDeleteMenu(id)
    },
    ...extendsToolsRender,
  }

  return {
    handleSelect,
    isAddChild,
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
