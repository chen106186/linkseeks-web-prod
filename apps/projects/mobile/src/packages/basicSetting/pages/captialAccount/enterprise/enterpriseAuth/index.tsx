import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, Text, Input, Form, Toast, Button, StandardForm, Steps, NewSteps, NoticeBar } from '@apps/mobile-ui'
import { showToast, showLoading, hideLoading, navigateToMiniProgram } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postPayAllInPayRegisterCompanyMember } from '@apps/apis'
import AgreementLayout from '@/components/Agreement'
import PageInitLayout from '@/components/PageInitLayout'
import styles from './index.module.scss'
import { useMobileIntl } from '@apps/locales'
import { EAccountFormProvider, useEAccountContext } from './services/context'
import { useEAccountMemberInfo } from '@apps/services/eAccount/hooks/useEAccountMemberInfo'
import { preload } from '@apps/mobile-services/utils/taro'
const EnterpriseAuth = () => {
  const intl = useIntl()
  const {
    memberInfo,
    refreshPayMemberInfo,
    payMemberInfoLoading,
    isFinishProcess,
    isFinishMoneyProcess,
    isExistProcess,
    isExpiredProcess,
  } = useEAccountMemberInfo()
  const [visible, setVisible] = useState(false)
  const [bankName, setbankName] = useState('')
  const [agre, setagre] = useState<boolean>(true)
  const translate = useMobileIntl()

  // 重构
  const { formItems, setFormItems, form } = useEAccountContext()
  // useInitAccount()

  useEffect(() => {
    refreshPayMemberInfo()
  }, [])
  useEffect(() => {
    if (isFinishMoneyProcess) {
      Router.redirectTo('basicSetting/accountHome')
    }
  }, [isFinishMoneyProcess])
  // 提交数据
  const submit = async (isReAuth = false) => {
    const formData: any = form.getFieldsValue()
    showLoading({
      title: intl.formatMessage({
        id: 'pay.jiazaizhong',
        defaultMessage: '加载中',
      }),
    })
    if (!agre) {
      showToast({
        title: translate('mobile.resource.user.qingyueduxieyi'),
        icon: 'none',
      })
      return
    }
    const result = await postPayAllInPayRegisterCompanyMember({
      ...formData,
      jumpUrl: location.href,
      isReAuth,
    })
    hideLoading()
    if (result.code === 1000) {
      navigateToMiniProgram({
        appId: 'wxc46c6d2eed27ca0a',
        path: 'pages/merchantAddress/merchantAddress',
        extraData: {
          targetUrl: result.data.regInviteLink,
        },
      })
      // preload('params', {
      //   onConfirm: refreshPayMemberInfo,
      //   url: result.data.regInviteLink,
      // })
      // Router.navigateTo('basicSetting/webInfo')
    } else {
      showToast({
        title: result.message,
        icon: 'none',
      })
    }
  }
  const items = [
    {
      title: '企业信息采集',
      desc: memberInfo?.companyName,
    },
    {
      title: '绑定手机',
      desc: memberInfo?.phone,
    },
    {
      title: '账户提现协议签约',
      desc: memberInfo?.acctProtocolNo,
    },
  ]
  const goAccountHome = () => {
    Router.navigateTo('basicSetting/accountHome')
  }
  const renderBottom = () => {
    if (isFinishProcess) {
      return (
        <Button onClick={goAccountHome} type="primary">
          开户成功，返回首页
        </Button>
      )
    } else if (isExpiredProcess) {
      return (
        <Button type="secondary" onClick={() => submit(true)}>
          重新发起
        </Button>
      )
    } else if (isExistProcess) {
      return (
        <>
          <Button type="secondary" onClick={() => submit(true)}>
            重新发起
          </Button>
          <Button type="primary" onClick={() => submit(false)}>
            继续认证
          </Button>
        </>
      )
    } else {
      return (
        <>
          <Button type="primary" onClick={() => submit(false)}>
            提交审核
          </Button>
        </>
      )
    }
  }
  return (
    <PageInitLayout loading={payMemberInfoLoading || isFinishMoneyProcess}>
      <View className={styles.page}>
        <View className={styles.warp}>
          <View className={styles.warpItem}>
            <View className={styles.WarpTitle}>
              <Text className={styles.WarptitleText}>
                {intl.formatMessage({
                  id: 'pay.renzhengxinxi',
                  defaultMessage: '认证信息',
                })}
              </Text>
            </View>
            <StandardForm form={form}>
              <StandardForm.Item
                name="companyName"
                label={translate('mobile.resource.basicSetting.qiyemingchen')}
                initialValue={memberInfo?.companyName}
              >
                {isExistProcess && !isExpiredProcess ? (
                  <Text>{memberInfo?.companyName}</Text>
                ) : (
                  <Input
                    placeholder={translate.formatFormInputTip(translate('mobile.resource.basicSetting.qiyemingchen'))}
                  />
                )}
              </StandardForm.Item>
            </StandardForm>
          </View>
          <NoticeBar
            customStyle={{
              marginBottom: 24,
            }}
          >
            完成 ①-企业信息采集、②-绑定手机号 即可进行交易支付；如需开通账户提现功能，可选择签署 ③-账户提现协议签约。
          </NoticeBar>
          <View className={styles.warpItem}>
            <View className={styles.WarpTitle}>
              <Text className={styles.WarptitleText}>{translate('public.renzhenjindu')}</Text>
            </View>
            <NewSteps
              current={(memberInfo?.step || 0) > items.length ? items.length : memberInfo?.step}
              direction="vertical"
            >
              {items.map((v) => (
                <NewSteps.Step key={v.title} title={v.title} description={v.desc} />
              ))}
            </NewSteps>
          </View>
        </View>

        <View className={styles.footerContent}>
          {renderBottom()}
          <AgreementLayout
            click={(e) => setagre(e)}
            consentText="阅读并同意"
            customClassName={styles.agreementContent}
            columnType="2"
          />
        </View>
        {/* 选择银行弹出列表 */}
        {/* <Bank Visible={visible} onClose={() => setVisible(false)} onConfirm={onSelect} /> */}
      </View>
    </PageInitLayout>
  )
}
export default () => {
  return (
    <GlobalWrapper>
      <EAccountFormProvider>
        <EnterpriseAuth />
      </EAccountFormProvider>
    </GlobalWrapper>
  )
}
