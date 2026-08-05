import {
  postProductCustomerSaveOrUpdateCustomerAttribute,
  postProductCustomerSaveOrUpdateCustomerAttributeValue,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { useRequestApi, useToggle } from '@linkseeks/hooks'
import { Form, Input, Modal } from '@linkseeks/ui'
import { forwardRef, useImperativeHandle, useState } from 'react'

/**
 * 新增属性值弹窗
 * 外部通过ref 调用toggle方法，传入属性相关参数
 */
const AttrModal = forwardRef(({ refresh }: any, ref) => {
  const [attr, setAttr] = useState<any>({})
  const [visible, toggle] = useToggle(false)
  const [form] = Form.useForm()
  const translate = useWebIntl()
  const { loading, run } = useRequestApi(postProductCustomerSaveOrUpdateCustomerAttributeValue, {
    manual: true,
    onSuccess() {
      toggle()
      refresh()
    },
  })
  useImperativeHandle(ref, () => {
    return {
      toggle(props) {
        console.log(props)
        setAttr(props)
        toggle()
      },
    }
  })

  // 提交新增属性值
  const handleSubmit = () => {
    form.submit()
  }

  const handleFinish = (value) => {
    const { add } = value
    run({
      value: add,
      customerAttributeId: attr.id,
    })
  }
  return (
    <Modal
      title={translate('web.resource.commodity.tianjiashuxing')}
      open={visible}
      onOk={handleSubmit}
      onCancel={toggle}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form preserve={false} form={form} onFinish={handleFinish} labelCol={{ span: 8 }} labelAlign="left">
        <Form.Item label={translate('web.resource.commodity.guishushuxing')}>{attr.name}</Form.Item>
        <Form.Item
          label={translate('web.resource.commodity.xinzengshuxingzhi')}
          rules={[{ required: true }]}
          name="add"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default AttrModal
