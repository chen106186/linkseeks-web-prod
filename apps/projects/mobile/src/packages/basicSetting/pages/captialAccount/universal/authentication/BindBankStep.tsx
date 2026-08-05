import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Input, Form, Toast, StandardForm, Button, Modal } from '@apps/mobile-ui'
import { showLoading, hideLoading, showToast, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postPayAllInPayBindBankCardApply } from '@apps/apis'
import LineCard, { STATUS_ENUM } from '../../components/LineCard'
import { AuthenticationProvider, useAuthenticationContext } from './context'
import MessageTipBox from '../../components/MessageTipBox'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'

const BindBankStep = () => {
  const { step2Form, memberInfo } = useAuthenticationContext()
  const { countdown, start, sendLoading, canSend } = usePhoneVerify({
    api: async () => {
      if (memberInfo) {
        const res = await postPayAllInPayBindBankCardApply({
          bankCardNo: step2Form.getFieldValue('bankCardNo'),
          phone: step2Form.getFieldValue('phone'),
          cardCheck: 7,
        })
        return res
      }
    },
    onSendSuccess() {
      showToast({
        title: '发送成功',
      })
    },

    onSendError() {
      showToast({
        title: '发送失败',
      })
    },
    codeResetTime: 60,
  })

  const renderVerificationCode = () => {
    if (canSend) {
      return <View onClick={start}>获取验证码</View>
    } else {
      return <View>{countdown} s</View>
    }
  }

  const rules = {
    bankCardNo: [
      { required: true, message: '请输入银行卡号' },
      { len: 22, message: '最多输入22位数字' },
    ],
    verificationCode: [
      { required: true, message: '请输入验证码' },
      { len: 6, message: '请输入验证码' },
    ],
  }
  return (
    <StandardForm form={step2Form} rules={rules} style={{ paddingBottom: 60 }}>
      <LineCard title="持卡人信息">
        <StandardForm.Item label="姓名">
          <View>{memberInfo?.name}</View>
        </StandardForm.Item>
        <StandardForm.Item label="证件类型">
          <View>身份证</View>
        </StandardForm.Item>
        <StandardForm.Item label="证件号">
          <View>{memberInfo?.identityCardNo}</View>
        </StandardForm.Item>
        <StandardForm.Item label="手机号">
          <View>{memberInfo?.phone}</View>
        </StandardForm.Item>
      </LineCard>

      <LineCard title="银行卡信息">
        <MessageTipBox message="注意：银行卡的持卡人需与实名认证的实名信息一致"></MessageTipBox>
        <StandardForm.Item name="bankCardNo" label="银行卡号">
          <Input placeholder="请输入银行卡号" />
        </StandardForm.Item>
        <StandardForm.Item name="phone" label="银行预留手机号">
          <Input placeholder="请输入银行预留手机号" />
        </StandardForm.Item>
        <StandardForm.Item name="verificationCode" suffix={renderVerificationCode()}>
          <Input placeholder={'请输入验证码'} style={{ textAlign: 'left' }} />
        </StandardForm.Item>
      </LineCard>
    </StandardForm>
  )
}

export default BindBankStep
