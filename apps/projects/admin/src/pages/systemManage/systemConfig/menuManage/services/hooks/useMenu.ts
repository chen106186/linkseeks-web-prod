import { useTree } from '@apps/components'
import { createAsyncFormActions } from '@apps/formily'
import { useMemoizedFn, useToggle } from '@linkseeks/hooks'
import { useEffect, useImperativeHandle, useRef } from 'react'
import { useMenuContext } from '../context'
import { postMemberMenuConfigAddMenu, postMemberMenuConfigUpdateMenu } from '@apps/apis'
import useFormModalStatus from './useFormModalStatus'
import { Form, message } from '@linkseeks/ui'

const useMenu = (ref) => {
  const [formInstance] = Form.useForm()
  const [requestLoading, setRequestLoading] = useToggle(false)
  const { selectNode, updateTreeData, refreshTreeData, menuUtil } = useTree()
  const { formStatus, handleChangeFormStatus, toggle, visible } = useFormModalStatus({
    add() {
      formInstance.resetFields()
    },
    edit() {
      formInstance.setFieldsValue({
        menuNameList: [...selectNode?.menuNameList],
        path: selectNode?.path,
        id: selectNode?.id,
      })
    },
  })
  const { source } = useMenuContext()

  useImperativeHandle(ref, () => {
    return {
      toggleMenuModal: async (visible: boolean, formStatus: string) => {
        handleChangeFormStatus(formStatus)
        toggle(visible)
      },
      formInstance,
    }
  })

  const handleSubmit = useMemoizedFn(async () => {
    // if (!selectNode) {
    //   message.error('未选中节点，请检查')
    //   return
    // }
    const values = await formInstance.validateFields()
    setRequestLoading(true)
    try {
      if (formStatus === 'edit') {
        const { code } = await postMemberMenuConfigUpdateMenu({
          path: values.path,
          menuNameList: values.menuNameList,
          code: selectNode?.code,
          parentId: selectNode?.parentId as any,
          menuId: selectNode?.id as any,
          source: selectNode?.source,
        })
        if (code === 1000) {
          menuUtil.updateNode(values.id, values)
        }
      } else {
        // 如果没有selectNode 说明是在根节点新增，则parentId是0
        const parentId = selectNode ? selectNode.id : 0
        const { data, code } = await postMemberMenuConfigAddMenu({
          path: values.path,
          parentId: Number(parentId) || 0,
          source: source,
          name: values.name,
          menuNameList: values.menuNameList,
        })
        if (code !== 1000) {
          toggle(false)
          setRequestLoading(false)
          return
        }
        if (parentId === 0) {
          menuUtil.addRootNode(data)
        } else {
          menuUtil.addNode(parentId, data)
        }
      }
      toggle(false)
      refreshTreeData()
    } catch {}
    setRequestLoading(false)
  })

  return {
    handleSubmit,
    menuModalVisible: visible,
    menuModalToggle: toggle,
    menuModalRequestLoading: requestLoading,
    menuAction: formInstance,
    formInstance,
    formStatus,
  }
}

export default useMenu
