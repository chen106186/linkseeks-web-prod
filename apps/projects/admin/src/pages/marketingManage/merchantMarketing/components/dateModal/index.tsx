import React, { useCallback, useState } from 'react'
import { Modal, Form, DatePicker, Input } from 'antd'
import moment from 'moment'

interface DateModalProps {
  id?: number
  /** 标题 */
  title?: string
  /** 显示隐藏 */
  visible?: boolean
  /** 取消 */
  onCancel: Function
  /** 确定 */
  onSubmit: Function
  /** 接口 */
  fieldApi?: () => Promise<unknown>
}

const DateModalLayout: React.FC<DateModalProps> = (props: any) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const { id, title, visible, onCancel, onSubmit, fieldApi } = props

  const handleSubmit = useCallback(() => {
    form.validateFields().then((res) => {
      const params = {
        id,
        time: moment(res.time).format('x'),
        reason: res.reason,
      }
      console.log(params, fieldApi)
      setLoading(true)
      fieldApi(params)
        .then((res) => {
          if (res.code !== 1000) {
            setLoading(false)
            return
          }
          onSubmit()
        })
        .catch((err) => {
          setLoading(false)
        })
    })
  }, [id])

  return (
    <Modal title={`${title}原因`} visible={visible} onCancel={onCancel} confirmLoading={loading} onOk={handleSubmit}>
      <Form layout="vertical" form={form}>
        <Form.Item label={`${title}时间`} name="time" initialValue={moment(new Date())}>
          <DatePicker style={{ width: '100%' }} disabled format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label={`${title}原因`} name="reason" rules={[{ required: true, message: '请输入原因' }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default DateModalLayout
