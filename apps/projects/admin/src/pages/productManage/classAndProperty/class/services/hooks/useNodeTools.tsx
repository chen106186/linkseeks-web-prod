import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { Button, Popconfirm, Space, Tooltip } from '@linkseeks/ui'
import { FolderAddIcon, PackupIcon, PlusCircleIcon, SyncIcon, TrashIcon } from '@linkseeks/icons'
import { postProductPlatformDeleteCategory } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { useCategoryContext } from '../context'

const useNodeTools = () => {
  const { treeRef, categoryForm, setOperateType } = useCategoryContext()
  const intl = useIntl()

  const renderTools = (node: ITreeDataItem) => {
    const { setExpandKeys, menuUtil, updateTreeData, expandKeys } = treeRef.current

    const handleAdd = (e, isChild = false) => {
      e.stopPropagation()
      treeRef.current.setSelectNode(node)
      // 没有展开的话 则允许展开
      if (!expandKeys.includes(node.id)) {
        setExpandKeys(node.id, true)
      }
      categoryForm.resetFields()
      setOperateType(isChild ? 'AddChild' : 'Add')
    }

    const handleRemove = async (e) => {
      e.stopPropagation()
      postProductPlatformDeleteCategory({ id: Number(node.id) }).then((res) => {
        if (res.code === 1000) {
          menuUtil.removeNode(node.id)
          updateTreeData()
        }
      })
    }

    return (
      <Space>
        <Tooltip
          title={intl.formatMessage({
            id: 'components.xinzengjiedian',
            defaultMessage: '新增节点',
          })}
        >
          <Button type="normal" onClick={handleAdd} icon={<PlusCircleIcon size={16} color="#919B9A" />} />
        </Tooltip>
        <Tooltip
          title={intl.formatMessage({
            id: 'components.xinzengzijiedian',
            defaultMessage: '新增子节点',
          })}
        >
          <Button
            type="normal"
            onClick={(e) => handleAdd(e, true)}
            icon={<PlusCircleIcon size={16} color="#919B9A" />}
          />
        </Tooltip>
        <Tooltip title={'删除'}>
          <Popconfirm
            title={intl.formatMessage({
              id: 'material.group.delete.tips',
              defaultMessage: '确定要删除吗？',
            })}
            onConfirm={handleRemove}
          >
            <Button type="normal" icon={<TrashIcon size={16} color="#919B9A" />} />
          </Popconfirm>
        </Tooltip>
      </Space>
    )
  }

  /**
   * 重置所有用户行为的操作，例如选中节点
   */
  const resetCtl = () => {
    treeRef.current.setSelectKeys([])
    treeRef.current.setSelectNode(null as any)
  }

  const renderHeadTools = () => {
    const onAdd = () => {
      resetCtl()
      categoryForm.resetFields()
      setOperateType('Add')
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
          <Button type="normal" style={{ marginLeft: 16 }} onClick={onAdd}>
            <FolderAddIcon size={16} />
          </Button>
        </Tooltip>

        <Tooltip title="刷新">
          <Button type="normal" style={{ marginLeft: 16 }} onClick={refresh}>
            <SyncIcon size={16} />
          </Button>
        </Tooltip>
        <Tooltip title="收缩">
          <Button type="normal" style={{ marginLeft: 16 }} onClick={handleExpandAll}>
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
