import React, { useState, useEffect, useCallback } from 'react'
// import { SchemaForm } from '@apps/formily';
import { Form, Input, Row, Col, Button, Select, message, AutoComplete } from 'antd'
import styles from './index.less'
import { StepForwardOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import GetCaptchaCode from '../GetCaptchaCode'
import classNames from 'classnames'
import phoneRegExp from './utils'
import { encryptedByAES } from '@linkseeks/crypto'
import { postMemberSecurityEmailEmailTonew, postMemberSecurityPhoneSmsTonew } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { LevelType, PasswordStrength } from '@apps/components'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getTelCodeOptions, useTelCode } from '@apps/services'
const Option = Select.Option

const EditDataComponent = (props) => {
  const intl = useIntl()
  const [pwdStatus, setPwdStatus] = useState(null)
  const { telColOptions, getTelPattern } = useTelCode()
  const [canSendCode, setCanSandCode] = useState(false)
  const [inputCanEdit, setInputCanEdit] = useState(true)
  const { type } = props
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')

  const passwordValidator = async (rule, value) => {
    let temp = {}
    let length = value && value.length >= 8 && value.length <= 20
    let trim = !/\s\S+|^\s\S+|\s$/.test(value) //
    let compact = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)/.test(value) // 必须含有大小写和数字
    temp['length'] = length
    temp['trim'] = trim
    temp['compact'] = compact
    setPwdStatus(temp)
    if (length && trim && compact) {
      return Promise.resolve()
    } else {
      throw new Error(' ')
    }
  }

  // 密码验证
  const comfirmPwdValidator = async (rule, value) => {
    if (value != props.form.getFieldValue('password')) {
      throw new Error(intl.formatMessage({ id: 'accountSetting.twoPasswordsDifferent' }))
    }
  }

  // 手机号验证
  const phoneValidator = async (rule, value) => {
    const country = props.form.getFieldValue('country')
    if (!getTelPattern(country)) {
      setCanSandCode(false)
      throw new Error(intl.formatMessage({ id: 'accountSetting.inputCorrentPhoneNumble' }))
    }
    setCanSandCode(true)
  }

  // 邮箱验证
  const emailValidator = async (rule, value) => {
    const pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (!pattern.test(value)) {
      setCanSandCode(false)
      throw new Error(intl.formatMessage({ id: 'accountSetting.unvalidEmail' }))
    }
    setCanSandCode(true)
  }

  // 获取新手机手机验证码
  const getCode = () => {
    setInputCanEdit(false)
    const { form, type } = props
    const SERVICE_CHECK = {
      email: postMemberSecurityEmailEmailTonew,
      phone: postMemberSecurityPhoneSmsTonew,
    }
    const service = SERVICE_CHECK[type]
    const postData =
      props.type == 'phone'
        ? {
            telCode: `${form.getFieldValue('country')}`,
            phone: encryptedByAES(form.getFieldValue('newPhone')),
          }
        : { email: encryptedByAES(form.getFieldValue('email'), false) }
    service(postData)
  }

  const changeInputEdit = () => {
    setInputCanEdit(true)
  }

  return (
    <div>
      {type == 'loginPwd' ? (
        <>
          <Form.Item label={intl.formatMessage({ id: 'accountSetting.loginPsw' })} className={styles.passwordContainer}>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  name="password"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: passwordValidator,
                    },
                    {
                      validator(_, value) {
                        if (!value || !PATTERN_MAPS.password.test(value) || pwdLevel !== 'low') {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'accountSetting.loginPsw.level.tip',
                              defaultMessage: '当前密码强度弱，请重新设置密码',
                            }),
                          ),
                        )
                      },
                    },
                  ]}
                >
                  <Input.Password onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 0 }}>
                  <PasswordStrength value={password} onLevelChange={(level) => setPwdLevel(level)} />
                </Form.Item>
              </Col>
              {pwdStatus ? (
                <div className={styles.errors}>
                  <p className={styles.length}>
                    <span
                      className={classNames({
                        [styles.icon]: !pwdStatus.length,
                        [styles.success]: pwdStatus.length,
                      })}
                    >
                      {pwdStatus.length ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </span>
                    {intl.formatMessage({ id: 'accountSetting.pswLength' })}
                  </p>
                  <p className={styles.trim}>
                    <span
                      className={classNames({
                        [styles.icon]: !pwdStatus.trim,
                        [styles.success]: pwdStatus.trim,
                      })}
                    >
                      {pwdStatus.trim ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </span>
                    {intl.formatMessage({ id: 'accountSetting.pswNotEmptySymbol' })}
                  </p>
                  <p className={styles.compact}>
                    <span
                      className={classNames({
                        [styles.icon]: !pwdStatus.compact,
                        [styles.success]: pwdStatus.compact,
                      })}
                    >
                      {pwdStatus.compact ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </span>
                    {intl.formatMessage({ id: 'accountSetting.pswDiverse' })}
                  </p>
                </div>
              ) : null}
            </Row>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'accountSetting.confirmPsw' })}>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  name="comfirmPwd"
                  noStyle
                  rules={[{ validator: comfirmPwdValidator }]}
                  // rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </>
      ) : type == 'email' ? (
        <>
          <Form.Item label={intl.formatMessage({ id: 'accountSetting.emailAddress' })}>
            <Row gutter={10}>
              <Col span={14}>
                <Form.Item name="email" noStyle rules={[{ validator: emailValidator }]}>
                  <Input disabled={!inputCanEdit} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <div className={styles.captchaBtn}>
                  <GetCaptchaCode getCode={getCode} callback={changeInputEdit} disable={!canSendCode} />
                </div>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'accountSetting.emailCode' })}>
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item
                  name="emailCaptcha"
                  noStyle
                  rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputEmailCode' }) }]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item label={intl.formatMessage({ id: 'accountSetting.newPhoneNumble' })}>
            <Row gutter={10}>
              <Col span={6}>
                <Form.Item
                  name="country"
                  noStyle
                  rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputPhoneNumble' }) }]}
                >
                  <Select disabled={!inputCanEdit}>
                    {telColOptions.map((item, key) => {
                      return (
                        <Option key={key} value={item.value}>
                          {item.label}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  name="newPhone"
                  dependencies={['country']}
                  noStyle
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) {
                          setCanSandCode(false)
                          return Promise.resolve()
                        }

                        if (getTelPattern(getFieldValue('country')).test(value)) {
                          setCanSandCode(true)
                          return Promise.resolve()
                        } else {
                          setCanSandCode(false)
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({
                                id: 'accountSetting.inputCorrentPhoneNumble',
                                deaultMessage: '请填写正确的手机号',
                              }),
                            ),
                          )
                        }
                      },
                    }),
                  ]}
                >
                  <Input disabled={!inputCanEdit} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'accountSetting.code' })}>
            <Row gutter={10}>
              <Col span={14}>
                <Form.Item
                  name="phoneCaptcha"
                  rules={[{ required: true, message: intl.formatMessage({ id: 'accountSetting.inputCode' }) }]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Col>
              <Col span={6}>
                {/* <Button>获取验证码</Button> */}
                <div className={styles.captchaBtn}>
                  <GetCaptchaCode callback={changeInputEdit} getCode={getCode} disable={!canSendCode} />
                </div>
              </Col>
            </Row>
          </Form.Item>
        </>
      )}
    </div>
  )
}

export default EditDataComponent
