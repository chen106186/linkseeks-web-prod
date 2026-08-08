import React, { useState } from 'react'
import { Form, Input, Tooltip, Checkbox, Select } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import { FormInstance } from 'antd/es/form/Form'
import { encryptedByAES } from '@linkseeks/crypto'
import { LevelType, PasswordStrength, PasswordTooltip } from '@apps/components'
import { useTelCode } from '@apps/services'
import { sendRegisterSms, getSliderCaptcha } from '../../services/features'
import useAgreement from '../../services/hooks/useAgreement'
import SmsButton from '../SmsButton'
import styles from '../../index.less'

interface IProps {
  form: FormInstance<any>
  show: boolean
}

// 默认手机区号
const defaultTelCode = '+86'

const AccountInfo: React.FC<IProps> = (props) => {
  const { form, show } = props
  const intl = useIntl()
  const { agreementList } = useAgreement()
  //  密码强度
  const [pwdLevel, setPwdLevel] = useState<LevelType>('low')
  const [password, setPassword] = useState<string>('')
  const { telColOptions, getTelPattern } = useTelCode()

  const handleStartSms = (form, remoteImg, setLoading, callback) => {
    if (form.getFieldValue('phone')) {
      setLoading(true)
      sendRegisterSms({
        telCode: form.getFieldValue('telCode'),
        width: remoteImg.x,
        imgId: remoteImg.imgId,
        phone: encryptedByAES(form.getFieldValue('phone')),
      })
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
    <Form.Item className={styles['register-step-1']} hidden={!show}>
      <Form.Item>
        <div className={styles['formItem-row']}>
          <Form.Item name="telCode" className={styles['telCode']} initialValue={defaultTelCode}>
            <Select options={telColOptions} />
          </Form.Item>
          <Form.Item
            name="phone"
            dependencies={['telCode']}
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'user.qingtianxieshoujihao',
                  defaultMessage: '请填写手机号',
                }),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve()
                  }

                  if (getTelPattern(getFieldValue('telCode')).test(value)) {
                    return Promise.resolve()
                  } else {
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
            <Input />
          </Form.Item>
        </div>
      </Form.Item>
      <Form.Item>
        <div className={styles['formItem-row']}>
          <Form.Item
            name="smsCode"
            noStyle
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'user.qingtianxieyanzhengma' }),
              },
              {
                pattern: PATTERN_MAPS.smsCode,
                message: intl.formatMessage({ id: 'user.qingshuruzhengquede6wei' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'order.index.code.input',
                defaultMessage: '请输入短信验证码',
              })}
            />
          </Form.Item>
          <SmsButton
            form={form}
            className={styles['sms-button']}
            style={{ marginLeft: 16 }}
            validateField="phone"
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
                  id: 'user.qingtianxiedenglumima',
                  defaultMessage: '请填写登录密码',
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
                        id: 'user.level.tip',
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
      <Form.Item
        name="email"
        rules={[
          {
            pattern: PATTERN_MAPS.email,
            message: intl.formatMessage({
              id: 'user.qingshuruzhengquedeyouxiang',
              defaultMessage: '请输入正确的邮箱',
            }),
          },
        ]}
      >
        <Input
          placeholder={intl.formatMessage({
            id: 'user.qingshurunideyouxiang',
            defaultMessage: '请输入你的邮箱（选填）',
          })}
        />
      </Form.Item>
      <Form.Item
        name="isRead"
        className={styles['register-step-1-formItem']}
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error(
                      intl.formatMessage({
                        id: 'user.qingxiantongyigouxuanxieyi',
                        defaultMessage: '请先同意勾选协议',
                      }),
                    ),
                  ),
          },
        ]}
      >
        <Checkbox>
          <span style={{ fontSize: 12 }}>
            {intl.formatMessage({ id: 'user.yuedubingtongyi' })}
            <span className="commonPickColor">
              {agreementList &&
                agreementList.map((item) => (
                  <a key={`aggreem_${item.id}`} href={`/user/agreement?id=${item.id}`} target="_blank" rel="noreferrer">
                    《{item.title}》
                  </a>
                ))}
            </span>
          </span>
        </Checkbox>
      </Form.Item>
    </Form.Item>
  )
}

export default AccountInfo
