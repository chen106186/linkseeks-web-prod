import { useState } from 'react'
import SettingPanel from '@/pages/pageCustomized/components/SettingPanel'
import { changeProps, clearSelectedStatus } from '@apps/design-core'
import { Form, Switch } from 'antd'
import { getWebIntl } from '@apps/locales'

interface IProps {
  visible?: boolean
}

const VisibleSwitch: React.FC<IProps> = (props) => {
  const { visible, ...others } = props
  const [changeState, setChangeState] = useState<boolean>(false)
  const [componentForm] = Form.useForm()
  const translate = getWebIntl()

  const handleCancel = () => {
    clearSelectedStatus()
  }

  const handleConfirmSave = (e) => {
    componentForm.validateFields().then((values) => {
      e.preventDefault()
      if (!changeState) {
        clearSelectedStatus()
        return
      }

      changeProps({
        props: {
          ...others,
          ...values,
        },
      })
      clearSelectedStatus()
    })
  }

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <Form
        form={componentForm}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onValuesChange={() => setChangeState(true)}
      >
        <Form.Item
          label={translate('web.resource.shop.shifouxianshi')}
          name="visible"
          valuePropName="checked"
          initialValue={visible}
        >
          <Switch />
        </Form.Item>
      </Form>
    </SettingPanel>
  )
}

export default VisibleSwitch
