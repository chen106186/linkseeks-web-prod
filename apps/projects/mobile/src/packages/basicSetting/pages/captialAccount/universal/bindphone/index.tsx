import GlobalWrapper from '@/components/GlobalWrapper'
// BindbankCard

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Icons, Input, Form, Toast, StandardForm, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { getCurrentInstance, hideLoading, showLoading, showToast } from '@apps/mobile-services/utils/taro'
import { postPayAllInPayMemberRegAndBindPhoneApply, postPayAllInPayMemberRegAndBindPhoneConfirm } from '@apps/apis'
import styles from './index.module.scss'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { USER_INFO } from '@/constants/storage'
import { THEME_COLORS } from '@/constants/theme'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'
import LineCard from '../../components/LineCard'
import AgreementLayout from '@/components/Agreement'
const BindPhoneBlock = () => {
  const [form] = StandardForm.useForm()
  const [agre, setagre] = useState<boolean>(true)
  const { countdown, start, sendLoading, canSend } = usePhoneVerify({
    api: async () => {
      const res = await postPayAllInPayMemberRegAndBindPhoneApply({
        phone: form.getFieldValue('phone'),
      })
      return res
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
  useEffect(() => {
    initPage()
  }, [])
  const initPage = async () => {
    const { phone } = (await getAsyncStorage(USER_INFO)) || ''
    form.setFieldsValue({
      phone: phone,
    })
  }
  const renderVerificationCode = () => {
    if (sendLoading) {
      return <View>发送中</View>
    }
    if (canSend) {
      return <View onClick={start}>获取验证码</View>
    } else {
      return <View>{countdown} s</View>
    }
  }
  const submit = async () => {
    if (await form.validateFields()) {
      const values: any = form.getFieldsValue()
      showLoading({
        title: '提交中...',
      })
      const { code } = await postPayAllInPayMemberRegAndBindPhoneConfirm(values)
      hideLoading()
      if (code === 1000) {
        showToast({
          title: '认证成功',
        })
        Router.navigateTo('basicSetting/accountHome')
      } else {
        showToast({
          title: '认证失败',
        })
      }
    }
  }
  return (
    <View className={styles.page}>
      <LineCard title="绑定手机">
        <StandardForm
          form={form}
          rules={{
            phone: [
              {
                len: 11,
                message: '手机号最长11位',
              },
              {
                required: true,
                message: '请输入手机号',
              },
            ],
            verificationCode: [
              {
                len: 6,
                message: '验证码最长6位',
              },
              {
                required: true,
                message: '请输入验证码',
              },
            ],
          }}
        >
          <StandardForm.Item name="phone" label="手机号">
            <Input />
          </StandardForm.Item>
          <StandardForm.Item name="verificationCode" suffix={renderVerificationCode()}>
            <Input
              placeholder={'请输入验证码'}
              style={{
                textAlign: 'left',
              }}
            />
          </StandardForm.Item>
        </StandardForm>
      </LineCard>
      <View className={styles.bottomContainer}>
        <Button type="bluePrimary" onClick={() => submit()}>
          提交
        </Button>
        <AgreementLayout
          click={(e) => setagre(e)}
          consentText="阅读并同意"
          customClassName={styles.agreementContent}
          columnType="2"
          color={THEME_COLORS.primary}
        />
      </View>
    </View>
  )
}
export default GlobalWrapper(BindPhoneBlock)
