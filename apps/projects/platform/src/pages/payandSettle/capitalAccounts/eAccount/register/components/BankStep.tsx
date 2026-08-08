import {
  CardWrapper,
  FormItemWrapper,
  FormLayoutWrapper,
  StandardAgreement,
  StandardValidatePhoneCode,
  SubTitleWrapper,
} from '@apps/components'
import { Button, Form, Input } from '@linkseeks/ui'
import { useAuthenticationContext, useAuthStep } from '@apps/services/eAccount'
import React from 'react'
import styles from './index.less'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'
import { postPayAllInPayBindBankCardApply, postPayAllInPayBindBankCardConfirm } from '@apps/apis'
// 进行认证
const BankStep = ({ form }) => {
  const { memberInfo, setStep } = useAuthenticationContext()
  const validateCodeAction = usePhoneVerify({
    api: postPayAllInPayBindBankCardApply,
    codeResetTime: 60,
  })

  const sendCode = async () => {
    const result = await form.validateFields(['phone', 'bankCardNo'])
    validateCodeAction.start({
      bankCardNo: form.getFieldValue('bankCardNo'),
      phone: form.getFieldValue('phone'),
      cardCheck: 7,
    })
  }
  const handleSubmit = async () => {
    const values = await form.validateFields()

    const { code } = await postPayAllInPayBindBankCardConfirm({
      ...values,
    })

    if (code === 1000) {
      setStep(2)
    }
  }
  return (
    <CardWrapper title="银行卡信息" style={{ marginBottom: 0 }}>
      <div className={styles['container']}>
        <Form form={form} labelCol={{ span: 6 }} labelAlign="left" wrapperCol={{ span: 14 }}>
          <SubTitleWrapper title="持卡人信息">
            <FormLayoutWrapper>
              <FormItemWrapper label="姓名">
                <span>{memberInfo?.name}</span>
              </FormItemWrapper>
              <FormItemWrapper label="证件类型">
                <span>身份证</span>
              </FormItemWrapper>
              <FormItemWrapper label="证件号">
                <span>{memberInfo?.identityCardNo}</span>
              </FormItemWrapper>
            </FormLayoutWrapper>
          </SubTitleWrapper>

          <SubTitleWrapper title="银行卡信息">
            <FormLayoutWrapper>
              <FormItemWrapper name="bankCardNo" label="银行卡号" rules={[{ required: true }]}>
                <Input />
              </FormItemWrapper>
              <FormItemWrapper name="phone" label="银行预留手机号" rules={[{ required: true }]}>
                <Input />
              </FormItemWrapper>
              <FormItemWrapper name="verificationCode" label="验证码" rules={[{ required: true }]}>
                <StandardValidatePhoneCode {...validateCodeAction} handleSendCode={sendCode} />
              </FormItemWrapper>
            </FormLayoutWrapper>
          </SubTitleWrapper>
        </Form>

        <div className={styles['bottom-ctl-container']}>
          <Button type="primary" style={{ width: 250 }} onClick={handleSubmit}>
            绑定银行卡
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}

export default BankStep
