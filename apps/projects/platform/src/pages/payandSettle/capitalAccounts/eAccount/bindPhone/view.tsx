import React from 'react'
import {
  CardWrapper,
  FormItemWrapper,
  FormLayoutWrapper,
  PageHeaderWrapper,
  StandardForm,
  StandardFormTable,
  StandardValidatePhoneCode,
} from '@apps/components'
import { Button, Input, message, Space } from '@linkseeks/ui'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'
import { postPayAllInPayMemberRegAndBindPhoneApply, postPayAllInPayMemberRegAndBindPhoneConfirm } from '@apps/apis'
import { useHistory } from '@linkseeks/router-core'

const BindPhone = () => {
  const [form] = StandardForm.useForm()
  const history = useHistory()
  const phoneVerifyAction = usePhoneVerify({
    api: async () => {
      const res = await postPayAllInPayMemberRegAndBindPhoneApply({
        phone: form.getFieldValue('phone'),
      })

      return res
    },
    codeResetTime: 60,
  })

  const sendCode = async () => {
    const result = await form.validateFields(['phone'])
    if (result) {
      phoneVerifyAction.start()
    }
  }
  const handleSubmit = async () => {
    const values = await form.validateFields()

    const result = await postPayAllInPayMemberRegAndBindPhoneConfirm(values, { ctlType: 'none' })

    if (result.code === 1000) {
      message.success('开通成功')
      history.replace('/payandSettle/capitalAccounts/eAccount')
    } else {
      message.error(result.message)
    }
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button type="primary" onClick={handleSubmit}>
          立即开通
        </Button>
      }
    >
      <CardWrapper title="绑定手机">
        <StandardForm form={form}>
          <FormLayoutWrapper>
            <FormItemWrapper name="phone" label="手机号" rules={[{ required: true }]}>
              <Input />
            </FormItemWrapper>
            <FormItemWrapper name="verificationCode" label="验证码" rules={[{ required: true }]}>
              <StandardValidatePhoneCode {...phoneVerifyAction} handleSendCode={sendCode} />
            </FormItemWrapper>
          </FormLayoutWrapper>
        </StandardForm>
      </CardWrapper>
    </PageHeaderWrapper>
  )
}

export default BindPhone
