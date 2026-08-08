import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  RefObject,
} from 'react'
import classNames from 'classnames'
import { ITreeDataItem, MenuUtil, TreeId } from './MenuUtil'
import Loading from '../Loading'
import { TreeContext, TreeContextProps } from './context'
import StandardTree from './Tree'
import { useEventEmitter } from '@linkseeks/hooks'
import useCheck from './useCheck'
import { DataNode } from 'antd/lib/tree'

export interface TreeContainerProps {
  /**
   * 数据请求
   */
  request?: any
  children?: ReactNode

  dataSource?: ITreeDataItem[]
  /**
   * 节点点击触发函数
   */
  handleNodeClick?(node: any, e): void
  /**
   * 工具栏鼠标经过显示
   */
  autoHideTools?: boolean
  /**
   * 右侧工具栏列表
   */
  renderTools?(node: ITreeDataItem): ReactNode
  /**
   * 头部额外组件
   */
  headMeta?(): ReactNode
  /**
   * 头部工具栏
   */
  headTools?(): ReactNode
  /**
   * 节点新增按钮
   */
  handleToolAdd?(node: ITreeDataItem): void
  /**
   * 节点删除按钮
   */
  handleToolDelete?(node: ITreeDataItem): void

  /**
   * 树形菜单的高度
   */
  height?: number | string

  /**
   * 是否开启多选
   */
  checkable?: boolean

  /**
   * 标题
   */
  title?: string

  /**
   * 禁用掉所有操作, 只能做选择
   */
  disableAction?: boolean
  treeRef?: RefObject<TreeContextProps>

  onCheckChange?(checked: (string | number)[], node?: ITreeDataItem): void

  /**
   * 是否允许拖拽，需要返回一个布尔值，如果是true则表示允许
   */
  onAllowDrop?(info: any): boolean

  /**
   * 拖拽成功后的回调
   */
  onDragDrop?(info: any): void

  /**
   * 是否禁用树操作
   */
  disabled?: boolean
  wrapClassName?: string
  treeClassName?: string
  emptyRender?: () => React.ReactElement
  /**
   * 是否可以搜索
   */
  enableSearch?: boolean
  searchPlaceholder?: string
}

const TreeContainer = forwardRef((props: TreeContainerProps, ref) => {
  const {
    request,
    handleNodeClick,
    renderTools,
    handleToolDelete,
    handleToolAdd,
    height,
    treeRef,
    title,
    autoHideTools = false,
    checkable,
    children,
    onCheckChange,
    disableAction = false,
    onAllowDrop,
    onDragDrop,
    headTools,
    headMeta,
    disabled,
    wrapClassName,
    treeClassName,
    enableSearch = false,
    searchPlaceholder,
    emptyRender,
  } = props
  const [expandKeys, setExpandKeys] = useState<TreeId[]>([])
  const [selectKeys, setSelectKeys] = useState<TreeId[]>([])
  const [selectNode, setSelectNode] = useState<ITreeDataItem>()
  const [searchValue, setSearchValue] = useState<string>('')
  // 自动展开父级
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false)
  const menuUtil = useMemo(() => new MenuUtil(), [])
  const [treeData, setTreeData] = useState<ITreeDataItem[]>([])
  const [treeLoading, setTreeLoading] = useState(true)
  const checkAction = useCheck(menuUtil)
  const event$ = useEventEmitter()
  const handleExpandKeys = (nodeKey: TreeId, isFixed?: boolean) => {
    if (expandKeys.find((key) => nodeKey === key) && !isFixed) {
      setExpandKeys(expandKeys.filter((key) => nodeKey !== key))
    } else {
      setExpandKeys([...expandKeys, nodeKey])
    }
  }

  const handleExpandAll = () => {
    setExpandKeys([])
  }

  const updateTreeData = useCallback(() => {
    setTreeData([...menuUtil.treeData])
  }, [menuUtil.treeData])

  const refreshTreeData = async () => {
    if (request) {
      setTreeLoading(true)
      const { data } = await request()
      menuUtil.treeData = data
      menuUtil.hashTreeData = menuUtil.createHashTreeData(data)
      setTreeData(data)
      setTreeLoading(false)
    }
  }

  useEffect(() => {
    refreshTreeData()
  }, [])

  useEffect(() => {
    const loop = (data: ITreeDataItem[]): ITreeDataItem[] =>
      data.map((item) => {
        const strTitle = item.title || (item.name as string)
        let name: any = ''
        if (searchValue && typeof strTitle === 'string') {
          const index = strTitle.indexOf(searchValue)
          const beforeStr = strTitle.substring(0, index)
          const afterStr = strTitle.slice(index + searchValue.length)
          name =
            index > -1 ? (
              <span>
                {beforeStr}
                <span className="cp-tree-search-value">{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{strTitle}</span>
            )
        } else {
          name = <span>{strTitle}</span>
        }

        if (item.children) {
          return { name, title: strTitle, id: item.id, parentId: item.parentId, children: loop(item.children) }
        }

        return {
          name,
          id: item.id,
          title: strTitle,
          parentId: item.parentId,
        }
      })
    setTreeData(loop(treeData))
  }, [searchValue])

  const value = {
    expandKeys,
    autoExpandParent,
    setAutoExpandParent,
    setExpandKeys: handleExpandKeys,
    resetExpandKeys: setExpandKeys,
    setSearchValue,
    selectNode,
    setSelectNode,
    menuUtil,
    treeData,
    searchValue,
    setTreeData,
    updateTreeData,
    refreshTreeData,
    renderTools,
    handleNodeClick: handleNodeClick || function () {},
    event$,
    selectKeys,
    setSelectKeys,
    handleExpandAll,
    handleToolAdd,
    handleToolDelete,
    disableAction,
    setTreeLoading,
    checkAction,
  }

  useImperativeHandle(treeRef, () => value)

  return (
    <TreeContext.Provider value={value}>
      {treeLoading ? (
        <Loading />
      ) : (
        <div className={classNames(children ? 'cp-tree-container' : '', wrapClassName)}>
          <StandardTree
            height={height}
            checkable={checkable}
            title={title}
            enableSearch={enableSearch}
            searchPlaceholder={searchPlaceholder}
            onCheckChange={onCheckChange}
            onAllowDrop={onAllowDrop}
            onDragDrop={onDragDrop}
            headTools={headTools}
            autoHideTools={autoHideTools}
            headMeta={headMeta}
            disabled={disabled}
            className={treeClassName}
            emptyRender={emptyRender}
          />
          {children}
        </div>
      )}
    </TreeContext.Provider>
  )
})
export default TreeContainer
