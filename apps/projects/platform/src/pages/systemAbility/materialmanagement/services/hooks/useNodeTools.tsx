import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { Button, Popconfirm, Space } from '@linkseeks/ui'
import { FormIcon, PlusCircleIcon, TrashIcon } from '@linkseeks/icons'
import { postManageMaterialLibraryDel } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { useMaterialContext } from '../context'

const useNodeTools = () => {
  const { treeRef, menuForm, setMenuModalVisible, setOperateType } = useMaterialContext()
  const translate = useWebIntl()

  const renderTools = (node: ITreeDataItem) => {
    const { setExpandKeys, menuUtil, refreshTreeData, updateTreeData, expandKeys } = treeRef.current

    const handleAddChild = (e) => {
      e.stopPropagation()
      treeRef.current.setSelectNode(node)
      menuForm.resetFields()
      setOperateType('AddChild')
      setMenuModalVisible(true)
    }

    const handleEdit = (e) => {
      e.stopPropagation()
      treeRef.current.setSelectNode(node)
      setOperateType('EditMenu')
      setMenuModalVisible(true)
      menuForm.setFieldValue('name', node.name)
    }

    const handleRemove = (e) => {
      e.stopPropagation()
      postManageMaterialLibraryDel({ id: Number(node.id) }).then((res) => {
        if (res.code === 1000) {
          menuUtil.removeNode(node.id)
          setOperateType(undefined)
          updateTreeData()
        }
      })
    }

    return (
      <Space>
        <Button type="normal" onClick={(e) => handleAddChild(e)} icon={<PlusCircleIcon size={16} color="#919B9A" />} />
        <Button type="normal" onClick={(e) => handleEdit(e)} icon={<FormIcon size={16} color="#919B9A" />} />
        <Popconfirm title={translate('web.resource.system.shifoushanchugaimulu')} onConfirm={handleRemove}>
          <Button type="normal" icon={<TrashIcon size={16} color="#919B9A" />} />
        </Popconfirm>
      </Space>
    )
  }

  return {
    renderTools,
  }
}

export default useNodeTools
