import { Form, FormInstance, Input, Modal } from '@linkseeks/ui'
import { forwardRef, useEffect, useRef } from 'react'
import useMenu from '../../services/hooks/useMenu'
import { ArrayFormTable, LanguageArrayFormTable } from '@apps/components'
import useLanguageFormField from '@apps/services/language/useLanguageFormField'
import { Validator } from '@apps/validator'

const validator = new Validator()
const MenuFormModal = forwardRef((_, ref) => {
  const { menuModalToggle, menuModalVisible, handleSubmit, menuModalRequestLoading, formStatus, formInstance } =
    useMenu(ref)
  useLanguageFormField('menuNameList', formInstance)

  return (
    <Modal
      title={formStatus === 'edit' ? '编辑菜单' : '新增菜单'}
      open={menuModalVisible}
      onCancel={() => menuModalToggle(false)}
      onOk={handleSubmit}
      okText={formStatus === 'edit' ? '保存' : '确认新增'}
      closable
      confirmLoading={menuModalRequestLoading}
      destroyOnClose
      width={1000}
    >
      <Form form={formInstance} labelCol={{ span: 6 }} labelAlign="left">
        <Form.Item
          label="菜单名称"
          name="menuNameList"
          required
          rules={[validator.validateLanguageRequired({ required: true, length: 100 })]}
        >
          <LanguageArrayFormTable maxLength={100} />
        </Form.Item>
        <Form.Item label="菜单链接" name="path">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default MenuFormModal
