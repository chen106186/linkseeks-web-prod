import React from 'react'
import { Modal, Form, Input } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { useHelpfulContext } from '../../context'
import { validatorByte } from '@/utils/regExp'

interface IProps {
  confirmLoading: boolean
  onOk: (name: string) => void
}

const MenuModal: React.FC<IProps> = (props) => {
  const { confirmLoading, onOk } = props
  const { menuForm, menuModalVisible, setMenuModalVisible, operateType } = useHelpfulContext()
  const intl = useIntl()

  const renderTitle = () => {
    switch (operateType) {
      case 'Add':
        return intl.formatMessage({ id: 'own.help.menu.modal.btn.add', defaultMessage: '添加菜单' })
      case 'EditMenu':
        return intl.formatMessage({ id: 'own.help.menu.modal.btn.edit', defaultMessage: '编辑菜单' })
      default:
        return intl.formatMessage({ id: 'own.help.menu.modal.btn.add', defaultMessage: '添加菜单' })
    }
  }

  const handleFinish = (values) => {
    onOk(values.name)
  }

  return (
    <Modal
      open={menuModalVisible}
      centered
      destroyOnClose
      title={renderTitle()}
      onCancel={() => setMenuModalVisible(false)}
      onOk={() => menuForm.submit()}
      confirmLoading={confirmLoading}
    >
      <Form labelCol={{ span: 4 }} labelAlign="left" form={menuForm} onFinish={handleFinish}>
        <Form.Item
          label={intl.formatMessage({ id: 'own.help.menu.modal.form.name', defaultMessage: '列表名称' })}
          name="name"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'own.help.menu.modal.form.name.required',
                defaultMessage: '请输入菜单名称',
              }),
            },
            {
              validator: (r, v, c) => validatorByte(r, v, c, 20),
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({
              id: 'own.help.menu.modal.form.name.required',
              defaultMessage: '请输入菜单名称',
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MenuModal
