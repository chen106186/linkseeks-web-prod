import React, { useState, useCallback } from 'react'
// import { SchemaForm } from '@apps/formily';
import { Form, Input, Button, Row, Col, message } from 'antd'
import SafeVerification from '../../SafeVerification'
import TypeForHeader from '../../TypeForHeader'
import EditDataComponent from '../../EditDataComponent'
import GetCaptchaCode from '../../GetCaptchaCode'
import { history } from '@linkseeks/router-manager'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  postMemberSecurityEmailEmail,
  postMemberSecurityEmailEmailCheck,
  postMemberSecurityEmailUpdate,
  postMemberSecurityPhoneEmail,
  postMemberSecurityPhoneEmailCheck,
  postMemberSecurityPhoneUpdate,
  postMemberSecurityPswEmail,
  postMemberSecurityPswEmailCheck,
  postMemberSecurityPswUpdate,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import useShowRiskCheck from './useShowRiskCheck'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 13 },
}

const tailLayout = {
  wrapperCol: { offset: 3, span: 13 },
}

const EmailVerifyPanel = (props) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const { email, pageType } = props
  const [captcha, setCaptcha] = useState<string>()
  const [form] = Form.useForm()
  const { canShowRiskCheck, onValuesChange } = useShowRiskCheck()

  const handleFinish = (values) => {
    const { pageType } = props
    ///member/security/email/
    const UPDATE_SERVICE = {
      loginPwd: postMemberSecurityPswUpdate,
      email: postMemberSecurityEmailUpdate,
      phone: postMemberSecurityPhoneUpdate,
    }
    const service = UPDATE_SERVICE[pageType]
    let params = {}
    if (pageType == 'loginPwd') {
      params = {
        ...params,
        password: encryptedByAES(values.password),
        emailCode: encryptedByAES(captcha),
      }
    } else if (pageType == 'email') {
      params = {
        ...params,
        smsCode: encryptedByAES(values.emailCaptcha),
        emailCode: encryptedByAES(captcha),
        email: encryptedByAES(values.email, false),
      }
    } else {
      params = {
        ...params,
        smsCode: encryptedByAES(values.phoneCaptcha),
        emailCode: encryptedByAES(captcha),
        telCode: values.country,
        phone: encryptedByAES(values.newPhone),
      }
    }

    service(params).then((data) => {
      if (data.code == 1000) {
        console.log('success')
        history.push('/systemAbility/accountSetting')
      }
    })
  }
  // 发送旧的邮箱验证码
  const getCode = useCallback(() => {
    let SERVICE_MAP = {
      loginPwd: postMemberSecurityPswEmail,
      email: postMemberSecurityEmailEmail,
      phone: postMemberSecurityPhoneEmail,
    }
    const service = SERVICE_MAP[props.pageType]
    service()
  }, [])

  // 验证旧的邮箱验证码
  const handleVerifySuccess = () => {
    const captcha = form.getFieldValue('captcha')
    let SERVICE_CHECK = {
      loginPwd: postMemberSecurityPswEmailCheck,
      email: postMemberSecurityEmailEmailCheck,
      phone: postMemberSecurityPhoneEmailCheck,
    }
    const service = SERVICE_CHECK[props.pageType]
    service({ smsCode: encryptedByAES(captcha) }).then((data) => {
      if (data.code == 1000) {
        setCaptcha(captcha)
        setVisible(true)
      }
    })
  }

  return (
    <div>
      <TypeForHeader type="email" email={email} />
      <Form
        {...layout}
        labelAlign="left"
        name="basic"
        onFinish={handleFinish}
        form={form}
        onValuesChange={onValuesChange}
      >
        {!visible ? (
          <>
            <Form.Item label={intl.formatMessage({ id: 'accountSetting.code' })}>
              <Row gutter={10}>
                <Col span={14}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputCode' }) }]}
                  >
                    <Input autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <GetCaptchaCode getCode={getCode} />
                </Col>
              </Row>
            </Form.Item>
            <div style={{ marginBottom: '130px' }}>
              <SafeVerification handleVerifySuccess={handleVerifySuccess} isDisabled={!canShowRiskCheck} />
            </div>
          </>
        ) : null}
        {visible ? (
          <>
            <EditDataComponent type={pageType} form={form} />
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'accountSetting.submit' })}
              </Button>
            </Form.Item>
          </>
        ) : null}
      </Form>
    </div>
  )
}

export default EmailVerifyPanel
