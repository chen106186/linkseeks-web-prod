import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Input, Form, Toast, StandardForm, Button, Modal } from '@apps/mobile-ui'
import LineCard, { STATUS_ENUM } from '../../components/LineCard'
import { AuthenticationProvider, useAuthenticationContext } from './context'

const AuthStep = () => {
  const { step1Form } = useAuthenticationContext()

  return (
    <LineCard title="认证信息">
      <StandardForm
        form={step1Form}
        rules={{
          name: [{ required: true, message: '请输入姓名' }],
          identityCardNo: [
            { required: true, message: '请输入证件号' },
            { len: 20, message: '证件号长度最长为20' },
          ],
        }}
      >
        <StandardForm.Item name="name" label="姓名">
          <Input placeholder="姓名" />
        </StandardForm.Item>
        <StandardForm.Item label="证件类型">
          <View>身份证</View>
        </StandardForm.Item>
        <StandardForm.Item name="identityCardNo" label="证件号">
          <Input placeholder="请输入证件号" />
        </StandardForm.Item>
      </StandardForm>
    </LineCard>
  )
}

export default AuthStep
