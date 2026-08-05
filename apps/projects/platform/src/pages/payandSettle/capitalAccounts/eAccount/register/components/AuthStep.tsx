import { CardWrapper, FormItemWrapper, FormLayoutWrapper, StandardAgreement } from '@apps/components'
import { Button, Form, Input, message, Modal } from '@linkseeks/ui'
import { useAuthenticationContext, useAuthStep } from '@apps/services/eAccount'
import React from 'react'
import useNotice, { NoticeColumnType } from '@apps/services/notice/useNotice'

import styles from './index.less'
// 进行认证
const AuthStep = ({ form }) => {
  const agreementAction = StandardAgreement.useAgreement()
  const { submit } = useAuthStep({ form: form })
  const { setStep } = useAuthenticationContext()
  const { notice } = useNotice(NoticeColumnType.MEMBER_SERVICE)

  const handleSubmit = async () => {
    if (!agreementAction.isRead) {
      message.error('请先勾选协议')
      return false
    }
    const values = await form.validateFields()

    const result = await submit(values)
    if (result) {
      message.success('认证成功')
      setStep(1)
    } else {
      message.error('认证失败')
    }
  }

  const showModal = (content) => {
    Modal.info({
      title: content.title,
      content: content.content,
    })
  }
  return (
    <CardWrapper title="认证信息" style={{ marginBottom: 0 }}>
      <div className={styles['container']}>
        <Form form={form} labelCol={{ span: 6 }} labelAlign="left" wrapperCol={{ span: 14 }}>
          <FormLayoutWrapper>
            <FormItemWrapper name="name" label="姓名" rules={[{ required: true }]}>
              <Input />
            </FormItemWrapper>
            <FormItemWrapper label="证件类型">
              <span>身份证</span>
            </FormItemWrapper>
            <FormItemWrapper name="identityCardNo" label="证件号" rules={[{ required: true }]}>
              <Input />
            </FormItemWrapper>
          </FormLayoutWrapper>
        </Form>

        <div className={styles['bottom-ctl-container']}>
          <Button type="primary" style={{ width: 250 }} onClick={handleSubmit}>
            下一步
          </Button>
          <StandardAgreement
            {...agreementAction}
            desc={
              <span>
                阅读并同意
                {notice?.map((v) => (
                  <Button type="link" onClick={() => showModal(v)}>
                    《{v.title}》
                  </Button>
                ))}
              </span>
            }
          />
        </div>
      </div>
    </CardWrapper>
  )
}

export default AuthStep
