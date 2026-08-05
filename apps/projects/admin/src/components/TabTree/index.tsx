import React, { useState, ReactText, PropsWithChildren, useEffect, useRef } from 'react'
import { Tree, Space, Tooltip, Button, Input } from 'antd'
import { findItemAndDelete, findTreeKeys, treeReduction, getParentTreeTitles } from '@/utils'
import deepClone from 'clone'
import { TreeProps } from 'antd/lib/tree'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { useSelections } from '@linkseeks/hooks'
import './index.global.less'

const { Search } = Input

export interface TabTreeActions {
  selected: ReactText[]
  getExpandedKeys: () => ReactText[]
  getSelectKey: () => ReactText
  getSelectKeys: () => ReactText[]
  setExpandedKeys: (keys: ReactText[]) => void
  setSelectKey: (key: ReactText) => void
  setSelectKeys: (keys: ReactText[]) => void
  getParentPath: (id: ReactText) => string
  getParent: (id) => any
}

export interface toolsRenderProps {
  addNode?(node)
  addChildNode?(node)
  deleteNode?(node)
}

export interface TabTreeProps extends TreeProps {
  treeData: any[]
  fetchData?(params?): Promise<any>
  actions?: TabTreeActions
  title?: React.ReactNode
  showSave? // 是否显示保存按钮
  // 若传入该字段， 则会作为tree识别的节点, 默认是`key`, 传入后原有的key值将无效
  customKey?: string
  customTitle?: string | number
  handleSelect?: (key: ReactText, node: any) => void | Promise<any>
  handleSubmit?()
  toolsRender?: toolsRenderProps
  getMenuSelectData?(): Promise<any>
  handleCheck?: (keys: any, nodes: any) => {}
  customExpandkeys?: any[] // props 传入自定义展开的key
  enableSearch?: boolean // 是否可搜索
  searchPlaceholder?: string // 搜索
  resetSearch?: boolean
  addChildLevel?: number
}

export interface InnermostTreeNodeProps {}

export interface RenderIconsProps {
  addChildLevel?: number
  level: number | undefined
  node: any
  nowKey: any
  toolsRender?: toolsRenderProps
}

export const useTreeActions = (action?): TabTreeActions => {
  const actionRef = useRef<any>(null)
  actionRef.current = actionRef.current || action || createTreeActions()

  return actionRef.current
}

export const createTreeActions = () => {
  const actions: TabTreeActions = {
    selected: [],
    getExpandedKeys() {
      return []
    },
    getSelectKey() {
      return ''
    },
    getSelectKeys() {
      return []
    },
    setSelectKey() {},
    setSelectKeys() {},
    setExpandedKeys() {},
    getParentPath(id) {
      return ''
    },
    getParent(id) {
      return null
    },
  }
  return actions
}

const InnermostTreeNode: React.FC<PropsWithChildren<InnermostTreeNodeProps>> = (props) => {
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {/* <span className="tree-node-circle"></span> */}
      <span>{props.children}</span>
    </span>
  )
}

const RenderIcons: React.FC<RenderIconsProps> = (props) => {
  const { toolsRender, addChildLevel, level } = props
  // @todo 去掉点击active时， 保持icon显示
  // return <Space className={cx('god-tabtree-icons', props.nowKey === props.node.key ? 'show' : 'hide')}>
  return (
    <Space className={cx('god-tabtree-icons')}>
      <Tooltip title="新增节点">
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation()
            toolsRender && toolsRender.addNode && toolsRender.addNode(props.node)
          }}
        />
      </Tooltip>
      {(!addChildLevel || (addChildLevel && level && level < addChildLevel)) && (
        <Tooltip title="新增子节点">
          <PlusCircleOutlined
            onClick={(e) => {
              e.stopPropagation()
              toolsRender && toolsRender.addChildNode && toolsRender.addChildNode(props.node)
            }}
          />
        </Tooltip>
      )}

      <Tooltip title="删除当前节点">
        <DeleteOutlined
          onClick={(e) => {
            e.stopPropagation()
            toolsRender && toolsRender.deleteNode && toolsRender.deleteNode(props.node)
          }}
        />
      </Tooltip>
    </Space>
  )
}

// 将无children的叶子节点中的title 转化为带有样式的title， 由于每次render 都需要重新deepClone深拷贝，可以优化
// 在多选模式下无需转化
function transformSingleTitle(
  data,
  nowKey,
  checkable,
  disabled,
  toolsRender,
  customKey?,
  customTitle?,
  searchString?,
  addChildLevel?,
) {
  if (Array.isArray(data) && data.length > 0) {
    for (let item = 0; item < data.length; item++) {
      // 指定默认key
      if (customKey) {
        data[item]._key = data[item].key
        data[item].key = data[item][customKey]
      }
      if (data[item].children) {
        transformSingleTitle(
          data[item].children,
          nowKey,
          checkable,
          disabled,
          toolsRender,
          customKey,
          customTitle,
          searchString,
          addChildLevel,
        )
      }
      data[item]._title = data[item]._title || data[item].name
      const strTitle = data[item].name as string
      const index = strTitle.indexOf(searchString)
      const beforeStr = strTitle.substring(0, index)
      const afterStr = strTitle.slice(index + searchString?.length || 0)
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchString}</span>
            {afterStr}
          </span>
        ) : (
          <span>{strTitle}</span>
        )
      data[item].name = (
        <span
          className="god-tabtree-title"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {checkable || (data[item].children && data[item].children.length !== 0) ? (
            title
          ) : (
            <InnermostTreeNode>{title}</InnermostTreeNode>
          )}
          <div>
            {toolsRender && (
              <RenderIcons
                addChildLevel={addChildLevel}
                level={data[item].level}
                node={data[item]}
                nowKey={nowKey}
                toolsRender={toolsRender}
              />
            )}
          </div>
        </span>
      )
      // 使选中样式受控
      data[item].className = cx('god-tabtree-select', String(nowKey) === String(data[item].key) ? 'show' : 'hide')
      if (disabled) {
        data[item].disableCheckbox = disabled
      }
      if (customTitle) {
        data[item]._title = data[item].name
        data[item].name = data[item][customTitle]
      }
    }
  }
  return data
}

const TabTree: React.FC<TabTreeProps> = (props) => {
  const {
    title,
    treeData,
    actions,
    checkable,
    customKey,
    customTitle,
    toolsRender,
    disabled,
    showSave,
    getMenuSelectData,
    handleSubmit,
    handleCheck,
    customExpandkeys,
    enableSearch = false,
    searchPlaceholder = '搜索',
    checkStrictly = false,
    resetSearch,
    addChildLevel,
  } = props

  const selfActions = useTreeActions(actions)

  // 需展开的key
  const [expandkeys, setExpandkeys] = useState<ReactText[]>([])
  // 当前选中的node
  const [selectKey, setSelectKey] = useState<string | number>('')

  // 自动展开父级
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false)

  // 搜索的值
  const [searchValue, setSearchValue] = useState<string | undefined>('')

  useEffect(() => {
    if (resetSearch) {
      setSearchValue(undefined)
      setExpandkeys([])
    }
  }, [resetSearch])

  const data = transformSingleTitle(
    deepClone(treeData),
    selectKey,
    checkable,
    disabled,
    toolsRender,
    customKey,
    customTitle,
    searchValue,
    addChildLevel,
  )
  // 重写选择方法, 只有在开启多选的时候才会启用
  const checkedKeys = findTreeKeys(treeData, customKey)
  const { selected, select, setSelected, unSelect, allSelected, unSelectAll, selectAll } = useSelections(
    checkedKeys,
    [],
  )
  useEffect(() => {
    if (getMenuSelectData) {
      getMenuSelectData().then((res) => {
        const { ids } = res.data
        setSelected(ids)
      })
    }
  }, [])

  useEffect(() => {
    if (customExpandkeys?.length) {
      setExpandkeys(customExpandkeys)
      setAutoExpandParent(true)
    }
  }, [customExpandkeys])

  const toggleSelectAll = () => {
    if (allSelected) {
      unSelectAll()
    } else {
      selectAll()
    }
  }

  if (selfActions) {
    selfActions.getExpandedKeys = () => expandkeys
    selfActions.getSelectKey = () => selectKey
    selfActions.getSelectKeys = () => selected
    selfActions.selected = selected
    selfActions.setSelectKeys = (keys: ReactText[]) => {
      setSelected(keys)
    }
    selfActions.setExpandedKeys = (keys: ReactText[]) => {
      setExpandkeys(keys)
    }
    selfActions.setSelectKey = (key: ReactText) => {
      setSelectKey(key)
    }
    selfActions.getParentPath = (id: ReactText) => {
      return getParentTreeTitles(treeData, id, customKey)
    }

    selfActions.getParent = (id) => {
      const reductData = treeReduction(treeData, customKey)
      console.log(reductData, 'reductData')
      const targetInfo = reductData[id]
      const parentInfo = reductData[targetInfo.parentId]
      // fixbug 当选中根节点下的节点时， 由于无parentId， 需自动补充0
      return parentInfo || { id: 0 }
    }
  }
  const batchSelect = (items: any) => {
    if (items.checked) {
      // 更改为严格模式
      items.checked.forEach((v) => select(v))
    } else {
      items.forEach((v) => select(v))
    }
  }

  // 展开/收起的回调
  const onExpand = (expandedKeys) => {
    setAutoExpandParent(false)
    setExpandkeys(expandedKeys)
  }

  const getParentKey = (id: string, tree: any[]): React.Key => {
    let parentKey: React.Key
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item) => item.id === id)) {
          parentKey = node.id
        } else if (getParentKey(id, node.children)) {
          parentKey = getParentKey(id, node.children)
        }
      }
    }
    return parentKey!
  }

  const onSearchChange = (v) => {
    // todo 找到目标节点的父级key
    setSearchValue(v)
    if (v) {
      const reductData: any[] = Object.values(treeReduction(treeData))
      const dataList: any[] = []
      const generateList = (data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i]
          const { id } = node
          dataList.push({ id, name: node.name })
          if (node.children) {
            generateList(node.children)
          }
        }
      }
      generateList(reductData)
      const expandedKeys = dataList
        .filter((item) => {
          if (item['name'].indexOf(v) > -1) {
            return getParentKey(item.id, reductData)
          }
          return null
        })
        .map((item) => item.id)
        .filter((item, i, self) => item && self.indexOf(item) === i)
      setExpandkeys(expandedKeys)
      setAutoExpandParent(true)
    } else {
      setExpandkeys([])
    }
  }

  return (
    <div>
      {title && (
        <div className="god-tabtree-header">
          <div>{title}</div>
          {checkable && (
            <Button onClick={toggleSelectAll} disabled={disabled} type="link">
              {allSelected ? '取消全选' : '全选'}
            </Button>
          )}
          {showSave && checkable && (
            <Button onClick={handleSubmit} disabled={disabled} type="link">
              保存
            </Button>
          )}
        </div>
      )}
      {enableSearch && data?.length > 0 && (
        <Search
          style={{ marginBottom: 8 }}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(v: any) => setSearchValue(v.target.value)}
          onSearch={onSearchChange}
        />
      )}
      <Tree
        className="god-tabtree"
        treeData={data}
        blockNode
        checkable={checkable}
        checkedKeys={selected}
        expandedKeys={expandkeys}
        autoExpandParent={autoExpandParent}
        checkStrictly={checkStrictly}
        fieldNames={{ key: 'id', title: 'name', children: 'children' }}
        onExpand={onExpand}
        onCheck={(keys, nodes) => {
          const { node, checked, checkedNodes } = nodes
          checked ? batchSelect(keys as any) : setSelected(checkedNodes.map((v) => v.key))
          // 用户自定义的勾选后触发事件
          if (handleCheck) {
            handleCheck(keys, nodes)
          }
        }}
        onSelect={(keys, e) => {
          // 控制点击node时可以展开
          const { node, selected } = e
          // 用户自定义的选择后触发事件
          if (props.handleSelect) {
            const result = props.handleSelect(node.key, node)
            // 存在返回值则不执行选中事件, 一般用于切换node时，不希望离开当前页面
            if (result) {
              result
                .then(() => {
                  // 若promise 是resolve状态， 说明确认离开了当前页面
                  setSelectKey(selectKey === node.key ? '' : node.key)
                  setExpandkeys(
                    expandkeys.includes(node.key) ? findItemAndDelete(expandkeys, node.key) : [...expandkeys, node.key],
                  )
                })
                .catch(() => {})
              return false
            }
          }
          // 如果重复点击 需要取消选中
          setSelectKey(selectKey === node.key ? '' : node.key)
          setExpandkeys(
            expandkeys.includes(node.key) ? findItemAndDelete(expandkeys, node.key) : [...expandkeys, node.key],
          )
        }}
      ></Tree>
    </div>
  )
}

TabTree.defaultProps = {}

export default TabTree
