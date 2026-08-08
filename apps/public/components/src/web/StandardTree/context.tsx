import { ReactNode, createContext, useContext } from 'react'
import { ITreeDataItem, MenuUtil, TreeId } from './MenuUtil'
import type { EventEmitter } from '@linkseeks/hooks'
import type { ToolItem } from './Tool'
import useCheck from './useCheck'
export interface TreeContextProps {
  searchValue: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
  autoExpandParent: boolean
  setAutoExpandParent: React.Dispatch<React.SetStateAction<boolean>>
  /**
   * 操作菜单节点的方法类,可以对节点进行增删改查以及更新
   */
  menuUtil: MenuUtil
  /**
   * 当前选中的节点
   */
  selectNode?: ITreeDataItem
  /**
   * 展开节点的集合
   */
  expandKeys: TreeId[]
  /**
   * 被选中的节点集合
   */
  selectKeys: TreeId[]
  /**
   * 设置展开节点
   * @param nodeKey 节点信息
   * @param isFixed 是否保持展开状态不变
   */
  setExpandKeys(nodeKey: TreeId, isFixed?: boolean): void

  /**
   * 重置展开节点
   */
  resetExpandKeys(nodeKeyList: TreeId[]): void
  /**
   * 设置选中节点
   */
  setSelectKeys(selectKeys: TreeId[]): void

  /**
   * 设置选中节点
   */
  setSelectNode(node: ITreeDataItem): void

  /**
   * 设置树形数据
   */
  setTreeData(treeData: ITreeDataItem[]): void

  /**
   * 树形数据
   */
  treeData: ITreeDataItem[]

  /**
   * 更新树形数据的状态
   * 由于treeData并不能直接响应页面状态，所以需要通过该方法进行视图更新
   *
   * 如果需要刷新请求数据则应该使用refreshTreeData
   */
  updateTreeData(): void

  /**
   * 点击节点时触发
   */
  handleNodeClick(node: ITreeDataItem, e): void

  /**
   * 节点右侧额外的按钮工具栏
   */
  renderTools?(node: ITreeDataItem): ReactNode

  /**
   * 事件响应系统，可参考@linkseeks/hooks中的useEventEmitter
   * @todo 目前暂未给该组件提供任何事件响应, 不过可自定义
   */
  event$: EventEmitter<any>

  /**
   * 收起所有展开的节点
   */
  handleExpandAll(): void

  /**
   * 刷新树形结构数据，相当于回到初始化的时候
   */
  refreshTreeData(): void

  /**
   * 右侧工具栏中，点击新增触发
   */
  handleToolAdd?(node: ITreeDataItem): void

  /**
   * 右侧工具栏中，点击删除触发
   */
  handleToolDelete?(node: ITreeDataItem): void

  /**
   * 设置tree的loading状态
   */

  setTreeLoading(switcher: boolean): void

  checkAction: ReturnType<typeof useCheck>
  /**
   * 禁用掉所有操作
   */
  disableAction?: boolean
}

export const TreeContext = createContext<TreeContextProps>({} as TreeContextProps)

export const useTree = () => useContext(TreeContext)
