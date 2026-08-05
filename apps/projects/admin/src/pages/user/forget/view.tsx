import React, { useState } from 'react'
import { Tabs, Form, Input, Tooltip, Button, message, Select } from '@linkseeks/ui'
import UserHeader from '@/layouts/components/UserHeader'
import { PATTERN_MAPS } from '@/constants/regExp'
import { LevelType, PasswordStrength, PasswordTooltip } from '@apps/components'
import { decryptedByAES, encryptedByAES } from '@linkseeks/crypto'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { sendForgetSms, submitForgetForm } from './services/feature'
import SmsButton from '../components/SmsButton'
import styles from './index.less'
import VerifyModal from '../components/VerifyModal'
import { useGlobalLogo, useTelCode } from '@apps/services'
import { getOssUrlPath } from '@apps/constants'

// 默认手机区号
const defaultTelCode = '+86'

const Forget: React.FC = () => {
  const [activeKey, setActiveKey] = useState<'phone' | 'email'>('phone')
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [checkLoading, setCheckLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [checkAccount, setCheckAccount] = useState<string>()
  const [form] = Form.useForm()
  const [verifyForm] = Form.useForm()
  const { telColOptions, getTelPattern } = useTelCode()
  const { logo } = useGlobalLogo()

  const handleStartSms = (form, _, setLoading, callback) => {
    const account = form.getFieldValue(activeKey)
    if (account) {
      setLoading(true)
      sendForgetSms(
        activeKey,
        activeKey === 'phone'
          ? {
              telCode: form.getFieldValue('telCode'),
              phone: encryptedByAES(account),
            }
          : {
              email: encryptedByAES(account, false),
            },
      )
        .then((res) => {
          if (res.code === 1000) {
            callback()
          }
        })
        .catch(() => {
          setLoading(false)
        })
      return
    }
  }

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const res = await submitForgetForm(values, setSubmitLoading, false)
      if (res.code === 1000) {
        // 超级管理员账号需要双重验证
        if (res.data.needCheck) {
          let tempCheckAccount = ''
          if (activeKey === 'phone') {
            if (res.data.email) {
              tempCheckAccount = decryptedByAES(res.data.email)
            }
          } else {
            if (res.data.phone) {
              tempCheckAccount = decryptedByAES(res.data.phone)
            }
          }

          if (tempCheckAccount) {
            setCheckAccount(tempCheckAccount)
            verifyForm.setFieldValue('checkAccount', tempCheckAccount)
            setModalVisible(true)
          } else {
            message.error('当前超级管理员账号存在安全风险，请通知管理人员重新设置账号验证信息')
          }
        } else {
          message.success('修改密码成功，请重新登录')
          history.redirect('/user/login')
        }
      } else {
        message.error(res.message)
      }
    })
  }

  const handleOk = () => {
    verifyForm.validateFields().then(async (values) => {
      const forgetVlues = form.getFieldsValue()
      const params = {
        ...forgetVlues,
        ...values,
      }
      console.log(values, 'values')
      if (activeKey === 'phone') {
        params.email = values.checkAccount
      } else {
        params.phone = values.checkAccount
      }

      const res = await submitForgetForm(params, setCheckLoading, true)
      if (res.code === 1000) {
        message.success('修改密码成功，请重新登录')
        history.redirect('/user/login')
      } else {
        message.error(res.message)
      }
    })
  }

  return (
    <div className={styles['user-layout']}>
      <UserHeader
        logo={logo || getOssUrlPath(`/%E7%93%B4%E7%8A%80logo-%E7%BE%8E%E6%94%BFcfbbb8d6580843359a0e7bab2c48b2b0.png`)}
      />
      <div className={styles['user-bg']}>
        <div className={styles.getBackBox}>
          <div className={styles.getBackForm}>
            <div className={styles['forget-form']}>
              <Tabs
                className={styles['forget-tabs']}
                defaultActiveKey={activeKey}
                onChange={(key) => setActiveKey(key as 'phone' | 'email')}
                items={[
                  {
                    label: `手机号验证`,
                    key: 'phone',
                  },
                  {
                    label: `邮箱验证`,
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
                          message: activeKey === 'phone' ? '请输入手机号' : '请输入邮箱',
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
                                return Promise.reject(new Error('请填写正确的手机号'))
                              }
                            } else {
                              if (PATTERN_MAPS.email.test(value)) {
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error('请输入正确的邮箱'))
                            }
                          },
                        }),
                      ]}
                    >
                      <Input placeholder={activeKey === 'phone' ? '请您输入手机号' : '请您输入邮箱'} />
                    </Form.Item>
                  </div>
                </Form.Item>
                <Form.Item>
                  <div className={styles['forget-form-sms']}>
                    <Form.Item
                      name={activeKey === 'phone' ? 'phoneSmsCode' : 'emailSmsCode'}
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: '请填写验证码',
                        },
                        {
                          pattern: PATTERN_MAPS.smsCode,
                          message: '请输入正确的6位验证码',
                        },
                      ]}
                    >
                      <Input placeholder={activeKey === 'phone' ? '请输入短信验证码' : '请输入邮箱验证码'} />
                    </Form.Item>
                    <SmsButton
                      form={form}
                      className={styles['sms-button']}
                      style={{ marginLeft: 16 }}
                      validateField={activeKey}
                      smsFn={handleStartSms}
                    />
                  </div>
                </Form.Item>
                <Form.Item>
                  <Tooltip placement="right" title={<PasswordTooltip password={password} />} color="#FFF">
                    <Form.Item
                      name="newPassword"
                      style={{ marginBottom: 0 }}
                      rules={[
                        {
                          required: true,
                          message: '请输入登录密码',
                        },
                        {
                          pattern: PATTERN_MAPS.password,
                          message: '请输入正确的密码',
                        },
                        {
                          validator(_, value) {
                            if (!value || !PATTERN_MAPS.password.test(value) || pwdLevel !== 'low') {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error('当前密码强度弱，请重新设置密码'))
                          },
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="请设置您的登录密码"
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
                  dependencies={['newPassword']}
                  rules={[
                    {
                      required: true,
                      message: '请填写登录密码',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次密码输入不一致'))
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请再次输入你的登录密码" type="password" autoComplete="new-password" />
                </Form.Item>
                <Form.Item>
                  <div className={styles['forget-form-bottom']}>
                    <Button onClick={handleSubmit} loading={submitLoading} block type="primary">
                      提交
                    </Button>
                    <Link to="/user/login" style={{ marginTop: 12 }}>
                      返回登录页
                    </Link>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <footer className={styles['user-footer']}>全链数字化解决方案</footer>
        <VerifyModal
          visible={modalVisible}
          setVisible={setModalVisible}
          form={verifyForm}
          onOk={handleOk}
          onCancel={() => setModalVisible(false)}
          account={checkAccount}
          type={activeKey === 'phone' ? 'email' : 'phone'}
          confirmLoading={checkLoading}
        />
      </div>
    </div>
  )
}

export default Forget
