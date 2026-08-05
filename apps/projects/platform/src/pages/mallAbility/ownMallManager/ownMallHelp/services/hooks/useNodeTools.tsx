import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { Button, Popconfirm, Space } from '@linkseeks/ui'
import { FormIcon, PlusCircleIcon, TrashIcon } from '@linkseeks/icons'
import { postCommodityShopHelpInfoDelete } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { useHelpfulContext } from '../context'
import { Fragment } from 'react'

const useNodeTools = () => {
  const { treeRef, menuForm, helpfulForm, setMenuModalVisible, setSelectHelpfulInfo, setOperateType } =
    useHelpfulContext()
  const intl = useIntl()

  const renderTools = (node: ITreeDataItem) => {
    const { setExpandKeys, menuUtil, refreshTreeData, updateTreeData, expandKeys } = treeRef.current

    const handleAddChild = (e) => {
      e.stopPropagation()
      // 没有展开的话 则允许展开
      if (!expandKeys.includes(node.id)) {
        setExpandKeys(node.id, true)
      }
      treeRef.current.setSelectNode(node)
      treeRef.current.setSelectKeys([])
      setSelectHelpfulInfo(undefined)
      helpfulForm.resetFields()
      setOperateType('AddChild')
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
      postCommodityShopHelpInfoDelete({ id: Number(node.id) }).then((res) => {
        if (res.code === 1000) {
          menuUtil.removeNode(node.id)
          setOperateType(undefined)
          updateTreeData()
        }
      })
    }

    return (
      <Space>
        {node.parentId === 0 && (
          <Fragment>
            <Button
              type="normal"
              onClick={(e) => handleAddChild(e)}
              icon={<PlusCircleIcon size={16} color="#919B9A" />}
            />
            <Button type="normal" onClick={(e) => handleEdit(e)} icon={<FormIcon size={16} color="#919B9A" />} />
          </Fragment>
        )}
        <Popconfirm
          title={intl.formatMessage({ id: 'own.help.tools.remove.tip', defaultMessage: '是否删除该帮助?' })}
          onConfirm={handleRemove}
        >
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
