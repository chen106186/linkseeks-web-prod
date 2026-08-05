import React from 'react'
import { Modal, Form, Input } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { validatorByte } from '@/utils/regExp'
import { useMaterialContext } from '../../context'

interface IProps {
  confirmLoading: boolean
  onOk: (name: string) => void
}

const MenuModal: React.FC<IProps> = (props) => {
  const { confirmLoading, onOk } = props
  const { menuForm, menuModalVisible, setMenuModalVisible, operateType } = useMaterialContext()
  const translate = useWebIntl()

  const renderTitle = () => {
    switch (operateType) {
      case 'Add':
        return translate('web.resource.system.tianjiamulu')
      case 'EditMenu':
        return translate('web.resource.system.bianjimulu')
      default:
        return translate('web.resource.system.tianjiamulu')
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
          label={translate('web.resource.system.mulumingcheng')}
          name="name"
          rules={[
            {
              required: true,
              message: translate('web.common.qingshuru'),
            },
            {
              validator: (r, v, c) => validatorByte(r, v, c, 20),
            },
          ]}
        >
          <Input placeholder={translate('web.common.qingshuru')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MenuModal
