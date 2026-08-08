import React, { useState, useCallback } from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import GetCaptchaCode from '../../GetCaptchaCode'
import SafeVerification from '../../SafeVerification'
import TypeForHeader from '../../TypeForHeader'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import { postMemberSecurityPaySms, postMemberSecurityPaySmsCheck, postMemberSecurityPayUpdate } from '@apps/apis'
import useShowRiskCheck from './useShowRiskCheck'
import { usePageStatus } from '@/hooks/usePageStatus'
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 13 },
}

const tailLayout = {
  wrapperCol: { offset: 4, span: 13 },
}

interface IProps {
  phone: string
  // 当前页面是属于 修改密码还是修改邮箱，还是修改手机
  pageType: string
}

const ResetPayCode: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const { phone, pageType } = props
  const { canShowRiskCheck, onValuesChange } = useShowRiskCheck()
  const [captcha, setCaptcha] = useState<string>()
  const { backPay } = usePageStatus()

  const onFinish = (values) => {
    const postData = {
      payPassword: encryptedByAES(values.password),
      phoneCode: encryptedByAES(captcha),
    }
    // /member/security/pay/update
    const service = postMemberSecurityPayUpdate
    service(postData).then((data) => {
      if (data.code == 1000) {
        if (backPay) {
          history.goBack()
        } else {
          history.push('/systemAbility/accountSetting')
        }
      }
    })
    console.log(values)
  }

  // 获取手机验证码
  const getCode = useCallback(() => {
    const service = postMemberSecurityPaySms
    service()
  }, [])

  // 检验 验证码
  const handleVerifySuccess = () => {
    const captcha = form.getFieldValue('captcha')
    const service = postMemberSecurityPaySmsCheck
    service({ smsCode: encryptedByAES(captcha) }).then((data) => {
      if (data.code == 1000) {
        setCaptcha(captcha)
        setVisible(true)
      }
    })
  }

  // 密码验证
  const comfirmPwdValidator = async (rule, value) => {
    if (value != form.getFieldValue('password')) {
      throw new Error(intl.formatMessage({ id: 'accountSetting.twoPasswordsDifferent' }))
    }
  }

  // 6位简单数字
  const numberValidator = async (rule, value) => {
    const pattern = /^\d{6}$/
    if (!pattern.test(value)) {
      throw new Error(intl.formatMessage({ id: 'accountSetting.setSixNumblePsw' }))
    }
  }

  // 支付密码
  const renderPwd = () => {
    return (
      <>
        <Form.Item label={intl.formatMessage({ id: 'accountSetting.setNewPayPsw' })}>
          <Row gutter={10}>
            <Col span={18}>
              <Form.Item
                name="password"
                noStyle
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'accountSetting.inputPayPsw' }) },
                  { validator: numberValidator },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'accountSetting.confirmPsw' })}>
          <Row gutter={10}>
            <Col span={18}>
              <Form.Item name="comfirmPwd" noStyle rules={[{ validator: comfirmPwdValidator }]}>
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </>
    )
  }

  return (
    <div>
      <TypeForHeader type="phone" phone={phone} />
      <Form {...layout} labelAlign="left" name="basic" onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
        {!visible ? (
          <>
            <Form.Item label={intl.formatMessage({ id: 'accountSetting.code' })}>
              <Row gutter={10}>
                <Col span={13}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputCode' }) }]}
                  >
                    <Input autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <div style={{ width: '150px' }}>
                    <GetCaptchaCode getCode={getCode} />
                  </div>
                </Col>
              </Row>
            </Form.Item>
            <div style={{ marginBottom: '150px' }}>
              <SafeVerification handleVerifySuccess={handleVerifySuccess} isDisabled={!canShowRiskCheck} />
            </div>
          </>
        ) : null}
        {visible ? (
          <>
            {renderPwd()}
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

export default ResetPayCode
