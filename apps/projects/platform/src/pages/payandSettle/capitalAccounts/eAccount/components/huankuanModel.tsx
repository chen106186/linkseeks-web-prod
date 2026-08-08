import React, { useState } from 'react'
import { Modal, Form, Input, Radio, message } from 'antd'
import { postPayEAccountAllInPayProxyRechargeBatchRefund } from '@apps/apis'

interface AuditModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess?: () => void
  rechargeId?: any
}

const AuditModal: React.FC<AuditModalProps> = ({ visible, onCancel, onSuccess, rechargeId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [auditStatus, setAuditStatus] = useState<number | undefined>()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const params = {
        rechargeId,
        remark: values.remark,
      }

      const res = await postPayEAccountAllInPayProxyRechargeBatchRefund(params, { ctlType: 'none' })

      if (res.code === 1000) {
        message.success('还款成功')
        onSuccess?.()
        onCancel()
      } else {
        message.error(res.message || '还款失败')
      }
    } catch (error) {
      // message.error('还款失败')
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
      title="还款"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} labelAlign="left">
        <Form.Item name="remark" label="还款备注">
          <Input.TextArea rows={3} placeholder="请输入还款备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AuditModal
