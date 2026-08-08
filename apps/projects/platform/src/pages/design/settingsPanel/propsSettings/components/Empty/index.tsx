import { useState } from 'react'
import SettingPanel from '@/pages/design/components/SettingPanel'
import { changeProps, clearSelectedStatus } from '@apps/design-core'
import { Form, InputNumber } from 'antd'
import { getWebIntl } from '@apps/locales'

interface IProps {
  componentHeight?: number
}

const Empty: React.FC<IProps> = (props) => {
  const { componentHeight = 200 } = props
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
          ...values,
          canDelete: true,
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
        wrapperCol={{ span: 18 }}
        onValuesChange={() => setChangeState(true)}
      >
        <Form.Item
          label={translate('web.resource.shop.zujiankuandu')}
          name="componentHeight"
          initialValue={componentHeight}
        >
          <InputNumber style={{ width: '100%' }} addonAfter="px" />
        </Form.Item>
      </Form>
    </SettingPanel>
  )
}

export default Empty
