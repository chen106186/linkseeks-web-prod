import { Form, FormInstance, Input, Modal } from '@linkseeks/ui'
import { forwardRef, useEffect, useRef } from 'react'
import useMenu from '../../services/hooks/useMenu'
import { ArrayFormTable, LanguageArrayFormTable, useTree } from '@apps/components'
import useLanguageFormField from '@apps/services/language/useLanguageFormField'
import { Validator } from '@apps/validator'
import { useRequestApi, useToggle } from '@linkseeks/hooks'
import { postMemberMenuConfigAddButton, postMemberMenuConfigUpdateButton } from '@apps/apis'
import { useMenuContext } from '../../services/context'
import useNodeClick from '../../services/hooks/useNodeClick'

const validator = new Validator()
const ButtonModal = forwardRef((_, ref) => {
  const { selectNode } = useTree()
  const { buttonVisible, handleButtonToggle, buttonFormStatus, buttonFormInstance, treeRef } = useMenuContext()
  const { handleClick } = useNodeClick()
  const { run: add, loading: addLoading } = useRequestApi(postMemberMenuConfigAddButton, {
    manual: true,
    onFinally() {
      handleButtonToggle()
    },
    onSuccess() {
      handleClick(selectNode)
    },
  })
  const { run: update, loading: updateLoading } = useRequestApi(postMemberMenuConfigUpdateButton, {
    manual: true,
    onFinally() {
      handleButtonToggle()
    },
    onSuccess() {
      handleClick(selectNode)
    },
  })
  useLanguageFormField('menuNameList', buttonFormInstance)

  const handleSubmit = async () => {
    const value = await buttonFormInstance.validateFields()

    if (buttonFormStatus === 'edit') {
      update({
        ...value,
      })
    } else {
      add({
        ...value,
        id: selectNode?.id,
      })
    }
  }
  return (
    <Modal
      title={buttonFormStatus === 'edit' ? '编辑按钮' : '新增按钮'}
      open={buttonVisible}
      onCancel={handleButtonToggle}
      onOk={handleSubmit}
      okText={buttonFormStatus === 'edit' ? '保存' : '确认新增'}
      closable
      confirmLoading={addLoading || updateLoading}
      destroyOnClose
      width={1000}
    >
      <Form form={buttonFormInstance} labelCol={{ span: 6 }} labelAlign="left">
        <Form.Item
          label="按钮名称"
          name="buttonNameList"
          required
          rules={[validator.validateLanguageRequired({ required: true, length: 100 })]}
        >
          <LanguageArrayFormTable maxLength={100} />
        </Form.Item>
        <Form.Item label="按钮路径" name="path">
          <Input />
        </Form.Item>
        <Form.Item name="id" hidden></Form.Item>
        <Form.Item name="code" hidden></Form.Item>
      </Form>
    </Modal>
  )
})

export default ButtonModal
