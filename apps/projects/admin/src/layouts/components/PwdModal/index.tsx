import React, { useState } from 'react'
import { registerValidationRules, createAsyncFormActions } from '@apps/formily'
import { Form, Input, Modal, Select, Tabs, Tooltip } from '@linkseeks/ui'
import { LevelType, PasswordStrength, PasswordTooltip } from '@apps/components'
import { PATTERN_MAPS } from '@/constants/regExp'
import { authService, useTelCode } from '@apps/services'
import SmsButton from '@/pages/user/components/SmsButton'
import { sendForgetSms } from '@/pages/user/forget/services/feature'
import { encryptedByAES } from '@linkseeks/crypto'
import styles from './index.less'

const actions = createAsyncFormActions()

registerValidationRules({
  passwordRule: (value) => {
    const pattern = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{8,16}$/
    return !pattern.test(value) ? '8-16个字符，由英文字母（区分大小写）、数字组成，请勿使用简单密码。' : ''
  },
  passwordIsSame: async (value) => {
    const newPwd = await actions.getFieldValue('newPwd')
    return newPwd !== value ? '两次密码不一致' : ''
  },
})

// 默认手机区号
const defaultTelCode = '+86'

const PwdModal = (props) => {
  const { form, visible, onCancel, onOk, confirmLoading } = props
  const auth = authService.getAuth()
  const [activeKey, setActiveKey] = useState<'phone' | 'email'>('phone')
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')

  const { telColOptions, getTelPattern } = useTelCode()

  const handleOk = () => {
    form.validateFields().then((values) => {
      !!onOk &&
        onOk({
          ...values,
          ...(activeKey === 'phone' ? { phone: auth?.phone } : activeKey === 'email' ? { email: auth?.email } : {}),
        })
    })
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  }

  const handleStartSms = (form, _, setLoading, callback) => {
    setLoading(true)
    sendForgetSms(
      activeKey,
      activeKey === 'phone'
        ? {
            telCode: auth?.telCode,
            phone: encryptedByAES(auth?.phone),
          }
        : {
            email: encryptedByAES(auth?.email, false),
          },
    )
      .then((res) => {
        if (res.code === 1000) {
          callback()
        } else {
          console.log('error', res)
          setLoading(false)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const hidePhoneNumber = (phoneNumber: string) => {
    // 使用正则表达式匹配手机号中的数字部分
    const regex = /(\d{3})(\d{4})(\d{4})/
    // 将中间的数字部分替换为星号
    const maskedNumber = phoneNumber.replace(regex, (_, prefix, middle, suffix) => {
      const maskedMiddle = '*'.repeat(middle.length) // 将中间部分替换为星号
      return `${prefix}${maskedMiddle}${suffix}`
    })
    return maskedNumber
  }

  const hideEmail = (email: string) => {
    // 使用正则表达式匹配电子邮件地址中的用户名和域名部分
    const regex = /^([^@]+)(@[^.]+\.[^.]+)$/
    // 将用户名部分中间的字符替换为星号
    const maskedEmail = email.replace(regex, (_, username, domain) => {
      const maskedUsername = '*'.repeat(username.length - 2) // 将用户名部分中间的字符替换为星号，保留第一个和最后一个字符
      return `${username[0]}${maskedUsername}${username.slice(-1)}${domain}`
    })
    return maskedEmail
  }

  const hideByType = (value: string | undefined) => {
    if (!value) return ''
    if (activeKey === 'phone') {
      return hidePhoneNumber(value)
    } else {
      return hideEmail(value)
    }
  }

  const tabList = [
    {
      key: 'phone',
      label: '手机号验证',
    },
    {
      key: 'email',
      label: '邮箱验证',
      hidden: !auth?.email,
    },
    {
      key: 'oldPwd',
      label: '旧密码验证',
      hidden: auth?.phone || auth?.email,
    },
  ].filter((item) => !item.hidden)

  return (
    <Modal
      open={visible}
      title="修改密码"
      onCancel={() => {
        form.resetFields()
        onCancel?.()
      }}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      maskClosable={false}
    >
      <Form form={form} {...layout}>
        <Form.Item
          name="oldPwd"
          label="旧密码"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: '请输入旧密码',
            },
          ]}
        >
          <Input.Password placeholder="请输入旧密码" type="password" autoComplete="new-password" />
        </Form.Item>
        <Tooltip placement="right" title={<PasswordTooltip password={password} />} color="#FFF">
          <Form.Item
            name="newPwd"
            label="新密码"
            labelAlign="left"
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: '请输入新密码',
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
              placeholder="请输入新密码"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Form.Item>
        </Tooltip>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <PasswordStrength value={password} onLevelChange={(level) => setPwdLevel(level)} />
        </Form.Item>
        <Form.Item
          name="comfirmPwd"
          label="新密码"
          labelAlign="left"
          // style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: '请再次输入新密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPwd') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次密码输入不一致'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" type="password" autoComplete="new-password" />
        </Form.Item>

        <Form.Item style={{}} label={'验证码验证'} required labelAlign="left">
          <Tabs
            className={styles['forget-tabs']}
            defaultActiveKey={activeKey}
            style={{ marginTop: -5 }}
            onChange={(key) => setActiveKey(key as 'phone' | 'email')}
            items={tabList}
          />
          <Form.Item name={activeKey} style={{ flex: 1 }} dependencies={['telCode']}>
            {activeKey === 'phone'
              ? `当前绑定手机号  ${hideByType(auth?.phone)}`
              : `当前绑定邮箱  ${hideByType(auth?.email)}`}
          </Form.Item>

          <Form.Item labelAlign="left">
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
                <Input placeholder={'请输入验证码'} />
              </Form.Item>
              <SmsButton
                form={form}
                className={styles['sms-button']}
                style={{ marginLeft: 16, height: 'auto', minWidth: 'auto' }}
                validateField={activeKey}
                smsFn={handleStartSms}
              />
            </div>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(PwdModal)
