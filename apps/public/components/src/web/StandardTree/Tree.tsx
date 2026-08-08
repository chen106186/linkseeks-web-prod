import React, { useRef, useState } from 'react'
import { Tree, Button, Tooltip, Input } from '@linkseeks/ui'
import { SelectallIcon } from '@linkseeks/icons'
import classNames from 'classnames'
import './index.global.less'
import { ITreeDataItem, TreeId } from './MenuUtil'
import { useTree } from './context'
import TreeNode from './TreeNode'
import { ArrowRightFillIcon } from '@linkseeks/icons'
import LineCard from '../LineCard'
import { useMemoizedFn, useMount } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'
const { DirectoryTree } = Tree

const StandardTree: React.FC<any> = ({
  onLoadData,
  height,
  checkable,
  onCheckChange,
  title,
  onAllowDrop,
  onDragDrop,
  headTools,
  headMeta,
  disabled,
  className,
  emptyRender,
  autoHideTools,
  enableSearch,
  searchPlaceholder,
}) => {
  const {
    menuUtil,
    expandKeys,
    setSearchValue,
    resetExpandKeys,
    updateTreeData,
    treeData,
    selectKeys,
    disableAction,
    checkAction,
    autoExpandParent,
    setExpandKeys,
    setSelectKeys,
    setSelectNode,
    setAutoExpandParent,
    handleNodeClick: nodeClick,
  } = useTree()

  const delayedDragEnterLogic = useRef<any>({})
  // 复制粘贴逻辑
  // const [copyNode, setCopyNode] = useState<ITreeDataItem>({} as ITreeDataItem)

  // 多选逻辑
  const { handleChecked, setSelected, selected, toggleAll, allSelected } = checkAction

  const translate = useWebIntl()

  useMount(() => {
    /**
     * 初始化的时候，处理一下check状态的节点
     *
     * 由于antd组件限制，会将selected中所有节点都按已选中的情况渲染
     *
     * 但实际情况是，假设第一级下面 只有一个菜单勾选， 按逻辑中 A 和 A - a 都需要算做被选中， 但A - b 不应该被选中， 而antd会自动勾选上，所以出现问题
     *
     * 这里需要将初始化的节点进行判断，如果这个节点所在的所有后代都被选中了才算选中
     *
     * 因为只是回显的时候会出问题 所以只需要执行一次
     */
    const results = selected?.filter((v) => {
      const target = menuUtil.hashTreeData[v]

      if (target.children && target.children.length > 0) {
        const temp = [...target.children]
        while (temp.length) {
          const item = temp.shift()
          if (!selected.includes(item!.id)) {
            return false
          }
          if (item?.children) {
            temp.push(...item.children)
          }
        }
      }
      return true
    })
    setSelected(results)
  })

  const handleNodeClick = (node, e) => {
    setExpandKeys(node.id)
    setSelectKeys([node.id])
    setSelectNode(node)
    nodeClick && nodeClick(node, e)
  }

  const renderSwitchIcon = (props) => {
    const { data, expanded } = props
    return (
      <ArrowRightFillIcon
        onClick={(e) => handleNodeClick(data, e)}
        size={16}
        style={{ transform: `rotate(${expanded ? '90' : '0'}deg)`, transformOrigin: 'center' }}
      />
    )
  }
  // 粘贴逻辑有问题
  // 由于粘贴时很难判断是否处于复制状态， 从而使得只是单纯的粘贴，也会让该事件生效
  // 暂时去掉
  // useEffect(() => {
  //   if (disableAction) {
  //     return
  //   }
  //   const handleCopyListener = (event) => {
  //     if (
  //       (event.ctrlKey && event.key === 'c') ||
  //       (event.metaKey && event.key === 'c') // 检查 Command 键（macOS）
  //     ) {
  //       setCopyNode(selectNode!)
  //     }
  //   }

  //   const handlePasteListener = (event) => {
  //     if (
  //       (event.ctrlKey && event.key === 'v') ||
  //       (event.metaKey && event.key === 'v') // 检查 Command 键（macOS）
  //     ) {
  //       menuUtil.pasteNode(selectNode!.id, copyNode)
  //       updateTreeData()
  //     }
  //   }

  //   document.addEventListener('keydown', handleCopyListener)
  //   document.addEventListener('keydown', handlePasteListener)

  //   return () => {
  //     document.removeEventListener('keydown', handleCopyListener)
  //     document.removeEventListener('keydown', handlePasteListener)
  //   }
  // }, [selectNode, copyNode, disableAction])

  // 复制粘贴逻辑结束

  /**
   * 拖拽功能
   */
  const onDrop = (info: any) => {
    Object.keys(delayedDragEnterLogic.current).forEach((key) => {
      clearTimeout(delayedDragEnterLogic.current[key])
    })

    if (onAllowDrop && onAllowDrop(info) === false) {
      // 如果是外部传入函数不允许拖拽 则终止后续逻辑
      return
    }
    menuUtil.switchNode(info)
    updateTreeData()
    onDragDrop && onDragDrop(info)
  }

  const handleCheckAll = () => {
    toggleAll()
    onCheckChange && onCheckChange(allSelected ? [] : menuUtil.getTreeDataKeys(menuUtil.treeData))
  }

  /**
   * 这里的handleCheck逻辑是 父子不关联时的使用方式
   * 由于0730版本，目的将节点可以拥有部分选中的情况，则是符合关联场景
   */
  // const handleCheck = async (_, { node }) => {
  //   const checkList = handleChecked(node)
  //   onCheckChange && onCheckChange(checkList)
  // }

  // 选择被选中的节点及其上一级节点的算法函数
  const selectNodes = useMemoizedFn((data: ITreeDataItem[], selectedNodes: TreeId[]): TreeId[] => {
    const selectedWithAncestors: Set<TreeId> = new Set()

    function dfs(data: ITreeDataItem[], ancestors: TreeId[]): void {
      data.forEach((node) => {
        const nodeId = node.id
        if (selectedNodes.includes(nodeId)) {
          // 如果节点被选中，则将该节点及其上一级节点添加到结果集合中
          ancestors.forEach((ancestorId) => selectedWithAncestors.add(ancestorId))
          selectedWithAncestors.add(nodeId)
        }

        if (node.children) {
          dfs(node.children, [...ancestors, nodeId])
        }
      })
    }

    // 从根节点开始进行深度优先搜索
    dfs(data, [])

    return Array.from(selectedWithAncestors)
  })

  const handleCheck = async (checkList, { node }) => {
    setSelected(checkList)
    // 这里经过了处理，由于勾选部分子级，不会自动把父级勾上， 这里通过计算获取并导出
    onCheckChange && onCheckChange(selectNodes(treeData, checkList))
  }

  const renderPublicTool = (
    <div className="cp-menu-tree-tool">
      {checkable && !disabled && (
        <Tooltip title={translate('web.common.selectAll', { defaultMessage: '全选' })}>
          <Button type="normal" onClick={handleCheckAll} icon={<SelectallIcon size={16} />}></Button>
        </Tooltip>
      )}

      {headTools && headTools()}
    </div>
  )

  // 拖拽自动展开节点
  const handleDragEnter = (info) => {
    if (onAllowDrop) {
      return
    }
    Object.keys(delayedDragEnterLogic.current).forEach((key) => {
      clearTimeout(delayedDragEnterLogic.current[key])
    })

    delayedDragEnterLogic.current[info.node.id] = window.setTimeout(() => {
      resetExpandKeys([...info.expandedKeys, info.node.id])
    }, 800)
  }

  const onSearchChange = (value: string) => {
    setSearchValue(value)
    if (value) {
      const reductData: any[] = Object.values(menuUtil.treeReduction(treeData))
      const searchNode = reductData.filter((item) => (item.title || item.name).indexOf(value) > -1)
      resetExpandKeys(searchNode.map((item) => item.id))
      setAutoExpandParent(true)
    } else {
      resetExpandKeys([])
    }
  }

  return (
    <div className={classNames('cp-menu-tree', className)}>
      {headMeta && headMeta()}
      <LineCard className="cp-menu-tree" style={{ height }} headExtra={renderPublicTool} headTitle={title}>
        {enableSearch && (
          <Input.Search style={{ marginBottom: 8 }} placeholder={searchPlaceholder} onSearch={onSearchChange} />
        )}
        <DirectoryTree
          loadData={onLoadData}
          showIcon={false}
          checkable={checkable}
          checkedKeys={selected}
          autoExpandParent={autoExpandParent}
          // checkStrictly
          onCheck={handleCheck as any}
          disabled={disabled}
          selectedKeys={selectKeys}
          draggable={disableAction ? false : { icon: false }}
          expandedKeys={expandKeys}
          fieldNames={{ key: 'id', children: 'children', title: 'name' }}
          treeData={treeData as any}
          titleRender={(node) => (
            <TreeNode node={node} handleNodeClick={handleNodeClick} autoHideTools={autoHideTools} />
          )}
          onDrop={onDrop}
          onDragEnter={handleDragEnter}
          switcherIcon={renderSwitchIcon}
        ></DirectoryTree>
        {(!treeData || (treeData && treeData.length === 0 && emptyRender)) && emptyRender()}
      </LineCard>
    </div>
  )
}

export default StandardTree
