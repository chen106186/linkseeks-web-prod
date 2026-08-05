import { useIntl } from '@linkseeks/i18n'
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
  const intl = useIntl()
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
          setLoading(false)
          form.resetFields()
        })
        .catch((err) => {
          setLoading(false)
        })
    })
  }, [id, fieldApi])

  return (
    <Modal
      title={`${title}${intl.formatMessage({ id: 'marketingAbility.yuanyin' })}`}
      visible={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={`${title}${intl.formatMessage({ id: 'marketingAbility.shijian' })}`}
          name="time"
          initialValue={moment(new Date())}
        >
          <DatePicker style={{ width: '100%' }} disabled format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label={`${title}${intl.formatMessage({ id: 'marketingAbility.yuanyin' })}`}
          name="reason"
          rules={[{ required: true, message: `${intl.formatMessage({ id: 'marketingAbility.qingshuruyuanyin' })}` }]}
        >
          <Input.TextArea rows={3} maxLength={50} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default DateModalLayout
