import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { useMenuContext } from '../context'
import { Button, Popconfirm, Tooltip } from '@linkseeks/ui'
import { EditFillIcon, FolderAddIcon, PackupIcon, PlusFillIcon, SyncIcon, TrashFillIcon } from '@linkseeks/icons'
import { postMemberMenuConfigDeleteMenu } from '@apps/apis'
import style from './nodeTools.less'

const useNodeTools = () => {
  const { treeRef, formRef, setButtonList, setInterfaceList } = useMenuContext()
  const renderTools = (node: ITreeDataItem) => {
    const { setExpandKeys, setSelectNode, setSelectKeys, menuUtil, updateTreeData, expandKeys } = treeRef.current

    const handleAdd = (e) => {
      // 没有展开的话 则允许展开
      if (expandKeys.includes(node.id)) {
        e.stopPropagation()
      } else {
        setExpandKeys(node.id, true)
      }
      // 来自 MenuFormModal 组件的方法
      formRef.current.toggleMenuModal(true, 'add')
    }

    const handleEdit = (e) => {
      // 没有展开的话 则允许展开
      if (expandKeys.includes(node.id)) {
        e.stopPropagation()
      } else {
        setExpandKeys(node.id, true)
      }
      setSelectNode(node)
      setSelectKeys([node.id])
      // 来自 MenuFormModal 组件的方法
      formRef.current.toggleMenuModal(true, 'edit')
    }
    const handleRemove = async (e) => {
      e.stopPropagation()
      await postMemberMenuConfigDeleteMenu({ id: Number(node.id) })
      menuUtil.removeNode(node.id)
      updateTreeData()
    }

    return (
      <>
        <Tooltip title="新增子菜单">
          <Button
            type="normal"
            className={style['head-icon']}
            onClick={handleAdd}
            icon={<PlusFillIcon size={16} />}
          ></Button>
        </Tooltip>

        <Tooltip title={node.path}>
          <Button
            type="normal"
            className={style['head-icon']}
            onClick={handleEdit}
            icon={<EditFillIcon size={16} />}
          ></Button>
        </Tooltip>

        <Popconfirm title="确定要删除吗" onConfirm={handleRemove}>
          <Button type="normal" className={style['head-icon']} icon={<TrashFillIcon size={16} />}></Button>
        </Popconfirm>
      </>
    )
  }

  /**
   * 重置所有用户行为的操作，例如选中节点
   */
  const resetCtl = () => {
    treeRef.current.setSelectKeys([])
    treeRef.current.setSelectNode(null as any)
    setButtonList([])
    setInterfaceList([])
  }

  const renderHeadTools = () => {
    const onAdd = () => {
      resetCtl()
      // 来自 MenuFormModal 组件的方法
      formRef.current.toggleMenuModal(true, 'add')
    }

    const refresh = () => {
      resetCtl()
      treeRef.current.refreshTreeData()
    }

    const handleExpandAll = () => {
      treeRef.current.handleExpandAll()
    }
    return (
      <>
        <Tooltip title="添加一级菜单">
          <Button type="normal" className={style['head-icon']} onClick={onAdd}>
            <FolderAddIcon size={16} />
          </Button>
        </Tooltip>

        <Tooltip title="刷新">
          <Button type="normal" className={style['head-icon']} onClick={refresh}>
            <SyncIcon size={16} />
          </Button>
        </Tooltip>
        <Tooltip title="收缩">
          <Button type="normal" className={style['head-icon']} onClick={handleExpandAll}>
            <PackupIcon size={16} />
          </Button>
        </Tooltip>
      </>
    )
  }

  return {
    renderTools,
    renderHeadTools,
  }
}

export default useNodeTools
