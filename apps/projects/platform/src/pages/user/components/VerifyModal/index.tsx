import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { ModalProps } from 'antd'
import { Modal, Form, Descriptions, Input, FormInstance } from '@linkseeks/ui'
import { PATTERN_MAPS } from '@/constants/regExp'
import { PostMemberSecurityCheckResponse } from '@apps/apis'
import SmsButton from '../SmsButton'
import style from './index.less'
import { useWebIntl } from '@apps/locales'
import { decryptedByAES } from '@linkseeks/crypto'

interface VerifyModalProps extends ModalProps {
  account: string | undefined
  visible: boolean
  form: FormInstance<any>
  type: 'phone' | 'email'
  setVisible: Dispatch<SetStateAction<boolean>>
  onSmsSend: Function
  accountInfo?: PostMemberSecurityCheckResponse
  onCheckTypeChange?: (type: 'phone' | 'email') => void
}

const VerifyModal: React.FC<VerifyModalProps> = (props) => {
  const { account, accountInfo, visible, form, type, onSmsSend, setVisible, onCheckTypeChange, ...modalProps } = props
  const translate = useWebIntl()
  const hidePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) {
      return ''
    }
    // 使用正则表达式匹配手机号中的数字部分
    const regex = /(\d{3})(\d{4})(\d{4})/
    // 将中间的数字部分替换为星号
    const maskedNumber = phoneNumber?.replace(regex, (_, prefix, middle, suffix) => {
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

  const hideByType = () => {
    if (!accountInfo) return ''
    if (type === 'phone') {
      if (!accountInfo.phone) return ''
      return hidePhoneNumber(decryptedByAES(accountInfo.phone))
    } else {
      if (!accountInfo.email) return ''
      return hideEmail(decryptedByAES(accountInfo.email))
    }
  }

  const showSwitchBUtton = useMemo(() => {
    const switchText =
      type === 'phone'
        ? translate('web.resource.login.changeEmailValidate')
        : translate('web.resource.login.changePhoneValidate')
    if (type === 'phone' && accountInfo?.email) {
      return (
        <div className={style['descriptions-item-switch']} onClick={() => onCheckTypeChange?.('email')}>
          {switchText}
        </div>
      )
    } else if (type === 'email' && accountInfo?.phone) {
      return (
        <div className={style['descriptions-item-switch']} onClick={() => onCheckTypeChange?.('phone')}>
          {switchText}
        </div>
      )
    } else {
      return null
    }
  }, [type, accountInfo])

  return (
    <Modal centered title="超级管理员账号双重验证" open={visible} {...modalProps}>
      <Form form={form}>
        <Descriptions column={1}>
          <Descriptions.Item label={type === 'phone' ? '手机号' : '邮箱'} className={style['descriptions-item']}>
            {hideByType()}
            {showSwitchBUtton}
          </Descriptions.Item>
        </Descriptions>
        <Form.Item name="checkAccount" hidden>
          <Input />
        </Form.Item>
        <Form.Item>
          <div className={style['forget-form-sms']}>
            <Form.Item
              name="smsCode"
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
              <Input maxLength={6} placeholder="请输入验证码" />
            </Form.Item>
            <SmsButton
              form={form}
              className={style['sms-button']}
              style={{ marginLeft: 16 }}
              validateField="checkAccount"
              smsFn={onSmsSend}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default VerifyModal
