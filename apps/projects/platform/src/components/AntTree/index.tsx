import React, { useState, ReactText, useEffect, useRef } from 'react'
import { Tree, Space, Tooltip, Input } from 'antd'
import { findItemAndDelete, findTreeKeys, treeReduction, getParentTreeTitles } from '@/utils'
import deepClone from 'clone'
import { TreeProps } from 'antd/lib/tree'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { useSelections } from '@linkseeks/hooks'
import { useIntl } from '@linkseeks/i18n'
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
  customKey?: string | number
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
}

export interface InnermostTreeNodeProps {}

export interface RenderIconsProps {
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

const InnermostTreeNode: React.FC<InnermostTreeNodeProps> = (props) => {
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <span className="tree-node-circle"></span>
      <span>{props.children}</span>
    </span>
  )
}

const RenderIcons: React.FC<RenderIconsProps> = (props) => {
  const { toolsRender } = props
  const intl = useIntl()
  // @todo 去掉点击active时， 保持icon显示
  // return <Space className={cx('god-tabtree-icons', props.nowKey === props.node.key ? 'show' : 'hide')}>
  return (
    <Space className={cx('god-tabtree-icons')}>
      <Tooltip title={intl.formatMessage({ id: 'components.xinzengjiedian' })}>
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation()
            toolsRender && toolsRender.addNode && toolsRender.addNode(props.node)
          }}
        />
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'components.xinzengzijiedian' })}>
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation()
            toolsRender && toolsRender.addChildNode && toolsRender.addChildNode(props.node)
          }}
        />
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'components.shanchudangqianjiedian' })}>
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
function transformSingleTitle(data, nowKey, checkable, disabled, toolsRender, customKey?, customTitle?) {
  if (Array.isArray(data) && data.length > 0) {
    for (let item = 0; item < data.length; item++) {
      // 指定默认key
      if (customKey) {
        data[item]._key = data[item].key
        data[item].key = data[item][customKey]
      }
      if (data[item].children) {
        transformSingleTitle(data[item].children, nowKey, checkable, disabled, toolsRender, customKey, customTitle)
      }
      data[item]._title = data[item]._title || data[item].title
      data[item].title = (
        <span
          className="god-tabtree-title"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {checkable || (data[item].children && data[item].children.length !== 0) ? (
            data[item].title
          ) : (
            <InnermostTreeNode>{data[item].title}</InnermostTreeNode>
          )}
          <div>{toolsRender && <RenderIcons node={data[item]} nowKey={nowKey} toolsRender={toolsRender} />}</div>
        </span>
      )
      // 使选中样式受控
      data[item].className = cx('god-tabtree-select', String(nowKey) === String(data[item].key) ? 'show' : 'hide')
      if (disabled) {
        data[item].disableCheckbox = disabled
      }
      if (customTitle) {
        data[item]._title = data[item].title
        data[item].title = data[item][customTitle]
      }
    }
  }
  return data
}

const TabTree: React.FC<TabTreeProps> = (props) => {
  const {
    treeData,
    actions,
    checkable,
    customKey,
    customTitle,
    toolsRender,
    disabled,
    getMenuSelectData,
    handleCheck,
    customExpandkeys,
    checkStrictly = false,
  } = props

  const selfActions = useTreeActions(actions)

  // 需展开的key
  const [expandkeys, setExpandkeys] = useState<ReactText[]>([])
  // 当前选中的node
  const [selectKey, setSelectKey] = useState<string | number>('')

  // 自动展开父级
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false)

  const data = transformSingleTitle(
    deepClone(treeData),
    selectKey,
    checkable,
    disabled,
    toolsRender,
    customKey,
    customTitle,
  )
  // 重写选择方法, 只有在开启多选的时候才会启用
  const checkedKeys = findTreeKeys(treeData, customKey)
  const { selected, select, setSelected } = useSelections(checkedKeys, [])
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
      return getParentTreeTitles(treeData, id)
    }

    selfActions.getParent = (id) => {
      const reductData = treeReduction(treeData)
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
  return (
    <Tree
      className="god-tabtree"
      treeData={data}
      blockNode
      checkable={checkable}
      checkedKeys={selected}
      expandedKeys={expandkeys}
      autoExpandParent={autoExpandParent}
      checkStrictly={checkStrictly}
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
    />
  )
}

TabTree.defaultProps = {}

export default TabTree
