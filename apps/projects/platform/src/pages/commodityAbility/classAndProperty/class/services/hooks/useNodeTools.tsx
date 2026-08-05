import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { Button, Popconfirm, Space, Tooltip } from '@linkseeks/ui'
import { PlusCircleIcon, TrashIcon } from '@linkseeks/icons'
import { postProductCustomerDeleteCustomerCategory } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { useCategoryContext } from '../context'
import { AddAuthButton, AuthButton } from '@apps/components'

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
      postProductCustomerDeleteCustomerCategory({ id: Number(node.id) }).then((res) => {
        if (res.code === 1000) {
          menuUtil.removeNode(node.id)
          updateTreeData()
        }
      })
    }

    return (
      <Space>
        <AddAuthButton>
          <Tooltip
            title={intl.formatMessage({
              id: 'components.xinzengjiedian',
              defaultMessage: '新增节点',
            })}
          >
            <Button type="normal" onClick={handleAdd} icon={<PlusCircleIcon size={16} color="#919B9A" />} />
          </Tooltip>
        </AddAuthButton>
        <AddAuthButton>
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
        </AddAuthButton>
        <AuthButton type="custom" code="delete">
          <Popconfirm
            title={intl.formatMessage({
              id: 'material.group.delete.tips',
              defaultMessage: '确定要删除吗？',
            })}
            onConfirm={handleRemove}
          >
            <Button type="normal" icon={<TrashIcon size={16} color="#919B9A" />} />
          </Popconfirm>
        </AuthButton>
      </Space>
    )
  }

  return {
    renderTools,
  }
}

export default useNodeTools
