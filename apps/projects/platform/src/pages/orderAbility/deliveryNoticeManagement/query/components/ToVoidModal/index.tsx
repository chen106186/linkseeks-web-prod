import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { postOrderDeliveryNoticeOrderInvalid } from '@apps/apis'
import dayjs from 'dayjs'

export type HandleType = {
  show: (flag: boolean, id?: string | number) => void
}

type PropsType = {
  onOk: () => void
}

const TextArea = Input.TextArea

const ToVoidModal = ({ onOk }: PropsType, ref: any) => {
  const [form] = Form.useForm()

  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const idRef = useRef<string | number>()

  const _onOk = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      postOrderDeliveryNoticeOrderInvalid({ id: idRef.current, ...values })
        .then(({ code, data }) => {
          if (code === 1000) {
            message.success('已作废')
            setVisible(false)
            onOk?.()
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  useImperativeHandle(ref, () => ({
    show(flag: boolean, id: string | number) {
      id && (idRef.current = id)
      setVisible(flag)
    },
  }))

  return (
    <Modal
      title={'作废原因'}
      maskClosable={false}
      destroyOnClose
      visible={visible}
      onOk={_onOk}
      okText="保存"
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
    >
      <Form form={form}>
        <Form.Item name="time" label="作废时间" required initialValue={dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="remark"
          label="作废原因"
          required
          rules={[
            { required: true, message: '请输入作废原因' },
            { pattern: /^[\u4e00-\u9fa5]{0,50}|[0-9a-zA-Z]{0,100}$/, message: '最大100个字符，50个文字' },
          ]}
        >
          <TextArea rows={3} maxLength={100} placeholder="请输入作废原因（最大100个字符，50个文字）" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(ToVoidModal)
