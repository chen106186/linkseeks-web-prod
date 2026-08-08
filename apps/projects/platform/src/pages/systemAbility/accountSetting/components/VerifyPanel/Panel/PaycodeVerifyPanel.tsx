import React, { useState } from 'react'
// import { SchemaForm } from '@apps/formily';
import { Form, Input, Button, Row, Col, message } from 'antd'
import SafeVerification from '../../SafeVerification'
import EditDataComponent from '../../EditDataComponent'
import { history } from '@linkseeks/router-manager'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  postMemberSecurityEmailUpdate,
  postMemberSecurityPayCheck,
  postMemberSecurityPhoneUpdate,
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

interface IProps {
  // 当前页面是属于 修改密码还是修改邮箱，还是修改手机
  pageType: string
}

const PaycodeVerifyPanel: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { pageType } = props
  const [visible, setVisible] = useState(false)
  const [paycode, setPaycode] = useState<string>()
  const [form] = Form.useForm()
  const { canShowRiskCheck, onValuesChange } = useShowRiskCheck('paycode')

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
        payPassword: paycode,
      }
    } else if (pageType == 'email') {
      params = {
        ...params,
        smsCode: encryptedByAES(values.emailCaptcha),
        email: encryptedByAES(values.email, false),
        payPassword: paycode,
      }
    } else {
      params = {
        ...params,
        smsCode: encryptedByAES(values.phoneCaptcha),
        telCode: values.country,
        phone: encryptedByAES(values.newPhone),
        payPassword: paycode,
      }
    }

    service(params).then((data) => {
      console.log('success')
      if (data.code == 1000) {
        history.push('/systemAbility/accountSetting')
      }
    })
  }

  // 验证旧的支付密码
  const handleVerifySuccess = () => {
    const payPassword = encryptedByAES(form.getFieldValue('paycode'))
    const service = postMemberSecurityPayCheck
    service({ payPassword: payPassword }).then((data) => {
      if (data.code == 1000) {
        setPaycode(payPassword)
        setVisible(true)
      }
    })
  }
  return (
    <div>
      {/* <TypeForHeader type="payCode" /> */}
      <Form
        {...layout}
        labelAlign="left"
        name="basic"
        form={form}
        onFinish={handleFinish}
        onValuesChange={onValuesChange}
      >
        {!visible ? (
          <>
            <Form.Item label={intl.formatMessage({ id: 'accountSetting.payPsw' })}>
              <Row gutter={10}>
                <Col span={18}>
                  <Form.Item
                    name="paycode"
                    noStyle
                    rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputPayPsw' }) }]}
                  >
                    <Input.Password autoComplete="off" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <div style={{ marginBottom: '130px' }}>
              <SafeVerification
                handleVerifySuccess={handleVerifySuccess}
                isDisabled={!canShowRiskCheck}
                tips={intl.formatMessage({ id: 'accountSetting.inputPayPsw', defaultMessage: '请填写支付密码' })}
              />
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

export default PaycodeVerifyPanel
