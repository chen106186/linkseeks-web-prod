import React, { useState } from 'react'
import { Modal, Form, Input, Radio, message } from 'antd'
import { postPayEAccountAllInPayProxyRechargeApprove } from '@apps/apis'

interface AuditModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess?: () => void
  record?: any
}

const AuditModal: React.FC<AuditModalProps> = ({ visible, onCancel, onSuccess, record }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [auditStatus, setAuditStatus] = useState<number | undefined>()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const params = {
        rechargeId: record?.id,
        status: values.status,
        remark: values.remark,
      }

      const res = await postPayEAccountAllInPayProxyRechargeApprove(params, { ctlType: 'none' })

      if (res.code === 1000) {
        message.success('审核成功')
        onSuccess?.()
        onCancel()
      } else {
        message.error(res.message || '审核失败')
      }
    } catch (error) {
      // message.error('审核失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setAuditStatus(undefined)
    onCancel()
  }

  return (
    <Modal
      title="充值审核"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} labelAlign="left">
        <Form.Item label="会员名称">
          <span>{record?.memberName || '-'}</span>
        </Form.Item>

        <Form.Item label="充值金额">
          <span>¥{record?.amount || '0.00'}</span>
        </Form.Item>

        <Form.Item label="充值备注">
          <span>{record?.remark || '-'}</span>
        </Form.Item>

        <Form.Item name="status" label="审核结果" rules={[{ required: true, message: '请选择审核结果' }]}>
          <Radio.Group onChange={(e) => setAuditStatus(e.target.value)}>
            <Radio value={1}>通过</Radio>
            <Radio value={0}>不通过</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="remark"
          label="审批备注"
          required={auditStatus === 0}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const status = getFieldValue('status')
                if (status === 0 && !value) {
                  return Promise.reject(new Error('审核不通过时审批备注必填'))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input.TextArea rows={3} placeholder="请输入审批备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AuditModal
