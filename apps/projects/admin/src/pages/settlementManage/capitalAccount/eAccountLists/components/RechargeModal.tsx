import React, { useState } from 'react'
import { Modal, Form, Input, message, Row, Col } from 'antd'
import { postPayEAccountAllInPayProxyRecharge } from '@apps/apis'

interface RechargeModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess?: () => void
  record?: any
}

const RechargeModal: React.FC<RechargeModalProps> = ({ visible, onCancel, onSuccess, record }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const params = {
        memberId: record?.memberId,
        memberRoleId: record?.memberRoleId,
        memberName: record?.memberName,
        money: values.money,
        remark: values.remark,
      }

      const res = await postPayEAccountAllInPayProxyRecharge(params, { ctlType: 'none' })

      if (res.code === 1000) {
        message.success('充值申请已提交请等待审核')
        form.resetFields()
        onSuccess?.()
        onCancel()
      } else {
        message.error(res.message || '充值失败')
      }
    } catch (error) {
      //message.error('充值失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="账户充值"
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

        <Form.Item label="会员状态">
          <span>{record?.memberStatus === 1 ? '正常' : record?.memberStatus === 2 ? '已冻结' : '-'}</span>
        </Form.Item>

        <Form.Item label="会员类型">
          <span>{record?.memberTypeName || '-'}</span>
        </Form.Item>

        <Form.Item label="会员角色">
          <span>{record?.memberRoleName || '-'}</span>
        </Form.Item>

        <Form.Item
          name="money"
          label="充值金额"
          rules={[
            { required: true, message: '请输入充值金额' },
            {
              validator: (_, value) => {
                if (value && value <= 0) {
                  return Promise.reject(new Error('充值金额必须大于0'))
                }
                if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
                  return Promise.reject(new Error('充值金额最多2位小数'))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder="请输入充值金额" />
        </Form.Item>

        <Form.Item name="remark" label="充值备注">
          <Input.TextArea rows={3} placeholder="请输入充值备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RechargeModal
