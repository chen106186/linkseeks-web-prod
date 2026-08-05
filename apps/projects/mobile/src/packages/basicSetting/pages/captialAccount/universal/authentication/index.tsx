import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Input, Form, Toast, StandardForm, Button, Modal } from '@apps/mobile-ui'
import { showLoading, hideLoading, showToast, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postPayAllInPayBindBankCardConfirm, postPayAllInPaySetRealName } from '@apps/apis'
import styles from './index.module.scss'
import Layout from '../../components/Layout'
import AgreementLayout from '@/components/Agreement'
import { THEME_COLORS } from '@/constants/theme'
import { AuthenticationProvider, useAuthenticationContext } from './context'
import AuthStep from './AuthStep'
import BindBankStep from './BindBankStep'
import AgreementStep from './AgreementStep'
const AuthenticationPage = () => {
  const [agre, setagre] = useState<boolean>(true)
  const { step, setStep, step1Form, step2Form, memberInfo, isDisabledStepBtn } = useAuthenticationContext()
  const items = [
    {
      title: '个人实名',
    },
    {
      title: '绑定银行卡',
    },
    {
      title: '提现协议',
    },
  ]
  const renderContent = () => {
    switch (step) {
      case 0: {
        return <AuthStep />
      }
      case 1: {
        return <BindBankStep />
      }
      case 2: {
        return <AgreementStep />
      }
      default: {
        return null
      }
    }
  }
  const renderBottom = () => {
    switch (step) {
      case 0: {
        return (
          <>
            <Button type="bluePrimary" onClick={() => goStep(1)}>
              下一步
            </Button>
            <AgreementLayout
              click={(e) => setagre(e)}
              consentText="阅读并同意"
              customClassName={styles.agreementContent}
              columnType="2"
              color={THEME_COLORS.primary}
            />
          </>
        )
      }
      case 1: {
        return (
          <Button type="bluePrimary" onClick={() => goStep(2)}>
            绑定银行卡
          </Button>
        )
      }
      case 2: {
        return (
          <Button type="bluePrimary" disabled={isDisabledStepBtn} onClick={finish}>
            完成认证
          </Button>
        )
      }
      default: {
        return null
      }
    }
  }
  const finish = () => {
    Router.redirectTo('basicSetting/accountHome')
  }
  const goStep = async (stepNum: number) => {
    if (stepNum === 1) {
      const result = await step1Form.validateFields()
      if (result) {
        // 下一步逻辑
        const values: any = step1Form.getFieldsValue()
        const res = await postPayAllInPaySetRealName({
          ...values,
          identityCardType: 1,
        })
        if (res.code === 1000) {
          showToast({
            title: '实名通过',
          })
          setStep(1)
        } else {
          showToast({
            title: '实名信息有误',
          })
        }
      }
    }
    if (stepNum === 2) {
      // 绑定银行卡逻辑
      const result = await step2Form.validateFields()
      if (result) {
        const values: any = step2Form.getFieldsValue()
        const { code } = await postPayAllInPayBindBankCardConfirm({
          phone: memberInfo?.phone,
          ...values,
        })
        if (code === 1000) {
          setStep(2)
        }
      }
    }
  }
  return (
    <View className={styles.page}>
      <Layout steps={step} items={items}>
        {renderContent()}

        <View className={styles.bottomContainer}>{renderBottom()}</View>
      </Layout>
    </View>
  )
}
export default GlobalWrapper(() => {
  return (
    <AuthenticationProvider>
      <AuthenticationPage />
    </AuthenticationProvider>
  )
})
