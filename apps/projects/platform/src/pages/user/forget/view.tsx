import React, { Fragment, useState } from 'react'
import { Form, Input, Tooltip, Button, Tabs, Select } from '@linkseeks/ui'
import { LevelType, PasswordStrength, PasswordTooltip } from '@apps/components'
import { Helmet } from 'react-helmet'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import { omit } from '@/utils'
import { encryptedByAES } from '@linkseeks/crypto'
import { useTelCode } from '@apps/services'
import { getSliderCaptcha, sendRegisterPwdSms, resetPwd } from '../register/services/features'
import SmsButton from '../register/components/SmsButton'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'
import { useForgetPwd } from './useForgetPwd'
import MultCompanyList from '../components/MultCompanyList'

// 默认手机区号
const defaultTelCode = '+86'

const Forget: React.FC = () => {
  const [activeKey, setActiveKey] = useState<'phone' | 'email'>('phone')
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')
  const { telColOptions, getTelPattern } = useTelCode()
  const [form] = Form.useForm()
  const intl = useIntl()
  const translate = useWebIntl()

  const {
    handleSubmitCheck,
    multiAccInfoRespList,
    multiAccountVisible,
    toggleMultiAccountVisible,
    activeUserId,
    setActiveUserId,
    handleSubmit,
  } = useForgetPwd(form)

  const handleStartSms = (form, remoteImg, setLoading, callback) => {
    const account = form.getFieldValue(activeKey)
    if (account) {
      setLoading(true)
      const params =
        activeKey === 'phone'
          ? {
              telCode: '+86',
              phone: encryptedByAES(account),
              width: remoteImg.x,
              imgId: remoteImg.imgId,
            }
          : {
              email: encryptedByAES(account, false),
            }

      sendRegisterPwdSms(params, activeKey)
        .then((res) => {
          callback(res)
        })
        .catch(() => {
          setLoading(false)
        })
      return
    }
  }

  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'user.zhaohuimima' })}</title>
      </Helmet>
      <div className={styles.getBackBox}>
        <div className={styles.getBackForm}>
          {multiAccountVisible ? (
            <MultCompanyList
              multiAccInfoRespList={multiAccInfoRespList}
              setActiveUserId={setActiveUserId}
              activeUserId={activeUserId}
              handleSubmit={handleSubmit}
              handleBack={toggleMultiAccountVisible}
              backText={translate('public.fanhuiwangjimima')}
              mult
              submitText={translate('web.common.confirm')}
              title={translate('public.wangjimima-jiance')}
            />
          ) : (
            <div className={styles['forget-form']}>
              <Tabs
                className={styles['forget-tabs']}
                defaultActiveKey={activeKey}
                onChange={(key) => setActiveKey(key as 'phone' | 'email')}
                items={[
                  {
                    label: translate('web.resource.login.phoneValidate'),
                    key: 'phone',
                  },
                  {
                    label: translate('web.resource.login.emailValidate'),
                    key: 'email',
                  },
                ]}
              />
              <Form form={form}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {activeKey === 'phone' && (
                      <Form.Item name="telCode" className={styles['telCode']} initialValue={defaultTelCode}>
                        <Select options={telColOptions} />
                      </Form.Item>
                    )}
                    <Form.Item
                      name={activeKey}
                      style={{ flex: 1 }}
                      dependencies={['telCode']}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'common.form.input.placeholder',
                            defaultMessage: '请输入',
                          }),
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.resolve()
                            }
                            if (activeKey === 'phone') {
                              if (getTelPattern(getFieldValue('telCode')).test(value)) {
                                return Promise.resolve()
                              } else {
                                return Promise.reject(
                                  new Error(
                                    intl.formatMessage({
                                      id: 'accountSetting.inputCorrentPhoneNumble',
                                      defaultMessage: '请填写正确的手机号',
                                    }),
                                  ),
                                )
                              }
                            } else {
                              if (PATTERN_MAPS.email.test(value)) {
                                return Promise.resolve()
                              }
                              return Promise.reject(
                                new Error(
                                  intl.formatMessage({
                                    id: 'authConfig.correntEmail',
                                    defaultMessage: '请输入正确的邮箱',
                                  }),
                                ),
                              )
                            }
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'common.form.input.placeholder',
                          defaultMessage: '请输入',
                        })}
                      />
                    </Form.Item>
                  </div>
                </Form.Item>
                <Form.Item>
                  <div className={styles['forget-form-sms']}>
                    <Form.Item
                      name="smsCode"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'payandSettle.capitalAccounts.eAccount.qingtianxieyanzheng',
                            defaultMessage: '请填写验证码',
                          }),
                        },
                        {
                          pattern: PATTERN_MAPS.smsCode,
                          message: intl.formatMessage({
                            id: 'user.qingshuruzhengquede6wei',
                            defaultMessage: '请输入正确的6位验证码',
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={
                          activeKey === 'phone'
                            ? intl.formatMessage({
                                id: 'payandSettle.capitalAccounts.eAccount.qingshuruduanxin',
                                defaultMessage: '请输入短信验证码',
                              })
                            : intl.formatMessage({
                                id: 'payandSettle.capitalAccounts.eAccount.qingshuruyouxiang',
                                defaultMessage: '请输入邮箱验证码',
                              })
                        }
                      />
                    </Form.Item>
                    <SmsButton
                      form={form}
                      className={styles['sms-button']}
                      style={{ marginLeft: 16 }}
                      validateField={activeKey}
                      smsFn={handleStartSms}
                      sliderFn={getSliderCaptcha}
                    />
                  </div>
                </Form.Item>
                <Form.Item>
                  <Tooltip placement="right" title={<PasswordTooltip password={password} />} color="#FFF">
                    <Form.Item
                      name="password"
                      style={{ marginBottom: 0 }}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'supplier.profile.passwrod.required',
                            defaultMessage: '请输入登录密码',
                          }),
                        },
                        {
                          pattern: PATTERN_MAPS.password,
                          message: intl.formatMessage({
                            id: 'user.qingshuruzhengquedemima',
                            defaultMessage: '请输入正确的密码',
                          }),
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
                      <Input.Password
                        placeholder={intl.formatMessage({
                          id: 'user.qingshezhinidedenglumi',
                          defaultMessage: '请设置您的登录密码',
                        })}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </Form.Item>
                  </Tooltip>
                  <PasswordStrength value={password} onLevelChange={(level) => setPwdLevel(level)} />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'user.qingtianxiedenglumima',
                        defaultMessage: '请填写登录密码',
                      }),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'user.liangcimimashurubuyi',
                              defaultMessage: '两次密码输入不一致',
                            }),
                          ),
                        )
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder={intl.formatMessage({
                      id: 'user.qingzaicishurunidedeng',
                      defaultMessage: '请再次输入你的登录密码',
                    })}
                    type="password"
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item>
                  <div className={styles['forget-form-bottom']}>
                    <Button htmlType="submit" onClick={() => handleSubmitCheck(activeKey)} block type="primary">
                      {intl.formatMessage({ id: 'common.button.submit', defaultMessage: '提交' })}
                    </Button>
                    <a href="/user/login" style={{ marginTop: 12 }}>
                      {intl.formatMessage({ id: 'user.fanhuidengluye', defaultMessage: '返回登录页' })}
                    </a>
                  </div>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default Forget
