import React, { useState } from 'react'
import { Modal, Form, Input, Button, message, Space } from '@linkseeks/ui'
import { postPayAllInPayBindBankCardApply, postPayAllInPayBindBankCardConfirm } from '@apps/apis'

interface BindCardModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess?: () => void
}

const BindCardModal: React.FC<BindCardModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 倒计时逻辑
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 获取验证码
  const handleGetCode = async () => {
    try {
      const values = await form.validateFields(['bankCardNo', 'phone'])
      setCodeLoading(true)

      const result = await postPayAllInPayBindBankCardApply(
        {
          bankCardNo: values.bankCardNo,
          phone: values.phone,
          cardCheck: 6,
        },
        { ctlType: 'none' },
      )

      if (result.code === 1000) {
        message.success('验证码发送成功')
        startCountdown()
      } else {
        message.error(result.message || '验证码发送失败')
      }
    } catch (error) {
      console.error('获取验证码失败:', error)
    } finally {
      setCodeLoading(false)
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const result = await postPayAllInPayBindBankCardConfirm(
        {
          phone: values.phone,
          verificationCode: values.verificationCode,
        },
        { ctlType: 'none' },
      )

      if (result.code === 1000) {
        message.success('银行卡绑定成功')
        form.resetFields()
        onSuccess?.()
        onCancel()
      } else {
        message.error(result.message || '绑定银行卡失败')
      }
    } catch (error) {
      console.error('绑定银行卡失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 手机号格式验证
  const validatePhone = (_: any, value: string) => {
    // 移除空值检查，因为required规则已经处理了
    if (value && value.trim()) {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(value)) {
        return Promise.reject(new Error('请输入正确的手机号格式'))
      }
    }
    return Promise.resolve()
  }

  return (
    <Modal title="绑定银行卡" open={visible} onCancel={onCancel} footer={null} width={500} destroyOnClose>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6, style: { textAlign: 'left' } }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSubmit}
      >
        <Form.Item name="bankCardNo" label="银行卡号" rules={[{ required: true, message: '请输入银行卡号' }]}>
          <Input placeholder="请输入银行卡号" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="绑卡手机"
          rules={[{ required: true, message: '请输入绑卡手机号' }, { validator: validatePhone }]}
        >
          <Input placeholder="请输入银行预留手机号" />
        </Form.Item>

        <Form.Item name="verificationCode" label="验证码" rules={[{ required: true, message: '请输入验证码' }]}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input placeholder="请输入验证码" style={{ flex: 1 }} />
            <Button type="primary" onClick={handleGetCode} loading={codeLoading} disabled={countdown > 0}>
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </div>
        </Form.Item>

        <div style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              确认绑定
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default BindCardModal
