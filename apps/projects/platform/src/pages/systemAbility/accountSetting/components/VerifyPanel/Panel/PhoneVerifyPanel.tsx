import React, { useCallback, useState } from 'react'
// import { SchemaForm } from '@apps/formily';
import { Form, Input, Button, Row, Col, message } from 'antd'
import SafeVerification from '../../SafeVerification'
import TypeForHeader from '../../TypeForHeader'
import EditDataComponent from '../../EditDataComponent'
import GetCaptchaCode from '../../GetCaptchaCode'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  postMemberSecurityEmailSms,
  postMemberSecurityEmailSmsCheck,
  postMemberSecurityEmailUpdate,
  postMemberSecurityPhoneSms,
  postMemberSecurityPhoneSmsCheck,
  postMemberSecurityPhoneUpdate,
  postMemberSecurityPswSms,
  postMemberSecurityPswSmsCheck,
  postMemberSecurityPswUpdate,
} from '@apps/apis'
import useShowRiskCheck from './useShowRiskCheck'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const tailLayout = {
  wrapperCol: { offset: 4, span: 13 },
}

interface IProps {
  phone: string
  // 当前页面是属于 修改密码还是修改邮箱，还是修改手机
  pageType: string
}

const PhoneVerifyPanel: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const [captcha, setCaptcha] = useState<string>()
  const [form] = Form.useForm()
  const { canShowRiskCheck, onValuesChange } = useShowRiskCheck()

  const { phone, pageType } = props
  const onFinish = (values) => {
    const { pageType } = props
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
        phoneCode: encryptedByAES(captcha),
      }
    } else if (pageType == 'email') {
      params = {
        ...params,
        smsCode: encryptedByAES(values.emailCaptcha),
        phoneCode: encryptedByAES(captcha),
        email: encryptedByAES(values.email, false),
      }
    } else {
      params = {
        ...params,
        smsCode: encryptedByAES(values.phoneCaptcha),
        phoneCode: encryptedByAES(captcha),
        telCode: values.country,
        phone: encryptedByAES(values.newPhone),
      }
    }
    service(params).then((data) => {
      if (data.code == 1000) {
        history.push('/systemAbility/accountSetting')
      }
    })
  }

  // 获取旧手机验证码
  const getCode = useCallback(() => {
    let SERVICE_MAP = {
      loginPwd: postMemberSecurityPswSms,
      email: postMemberSecurityEmailSms,
      phone: postMemberSecurityPhoneSms,
    }
    const service = SERVICE_MAP[props.pageType]
    service()
  }, [])

  const handleVerifySuccess = () => {
    const captcha = form.getFieldValue('captcha')
    // 验证旧手机短信/member/security/email/sms/
    let SERVICE_CHECK = {
      loginPwd: postMemberSecurityPswSmsCheck,
      email: postMemberSecurityEmailSmsCheck,
      phone: postMemberSecurityPhoneSmsCheck,
    }
    const service = SERVICE_CHECK[props.pageType]
    service({ smsCode: encryptedByAES(captcha) }).then((data) => {
      if (data.code === 1000) {
        setCaptcha(captcha)
        setVisible(true)
      }
    })
  }

  return (
    <div>
      <TypeForHeader type="phone" phone={phone} />
      <Form {...layout} labelAlign="left" name="basic" onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
        {!visible ? (
          <>
            <Form.Item label={intl.formatMessage({ id: 'accountSetting.code' })}>
              <Row gutter={10}>
                <Col span={8}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputCode' }) }]}
                  >
                    <Input autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={4}>
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

export default PhoneVerifyPanel
