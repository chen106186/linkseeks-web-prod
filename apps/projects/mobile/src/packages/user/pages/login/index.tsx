import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { View, Text, Image, ActionSheet, Checkbox, Modal } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import ModeMobile from '@/components/Modemobile'
import { useSafeArea } from '@apps/mobile-services'
import useStores from '@/store/useStores'
import { REGISTER_STORE_DATA } from '@/constants/storage'
import { THEME_COLORS } from '@/constants/theme'
import useLogin from './services/hooks/useLogin'
import { LoginContext, useLoginInit } from './services/contexts'
import { loginSuccess } from './services/features'
import MobileView from './components/Mobile'
import SingView from './components/Sing'
import OnClickView from './components/OnClick'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import useParameterValue from '@/hooks/useParameterValue'
import { getValueByLanguage } from '@/utils'
import logoPng from '@/assets/images/logo.png'
const Login = () => {
  const intl = useIntl()
  const { updatePwdToggle, loginData, dayCount, setUpdatePwdToggle, setLoginData, setDayCount } = useLoginInit()
  const {
    loginTypeText,
    current,
    toggle,
    isOpenToggle,
    telCode,
    phoneLength,
    agree,
    columnTypeList,
    setCurrent,
    setAgree,
    setIsOpenToggle,
    Confirm,
    onConfirm,
    goJump,
    onClose,
    onUpdatePassword,
    findAllByColumnType,
  } = useLogin()
  const translate = useMobileIntl()
  const { safeBottomHeight } = useSafeArea()
  const {
    userStore: { shopAndSite },
  } = useStores()
  const { loading, parameterValue } = useParameterValue()

  const renderComponentByType = () => {
    switch (current) {
      case 0:
        return <OnClickView agree={agree} />
      case 1:
        return <SingView agree={agree} />
      case 2:
        return <MobileView phoneLength={phoneLength} Confirm={Confirm} telCode={telCode} />
      default:
        return null
    }
  }
  usePageInit()
  useEffect(() => {
    findAllByColumnType()
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.dengru', defaultMessage: '登录' }) })
    removeAsyncStorage(REGISTER_STORE_DATA)
  }, [])
  const webView = (item: any) => {
    Router.navigateTo('basicSetting/webView', {
      id: item.id,
      type: 'sign',
    })
  }
  return (
    <LoginContext.Provider
      value={{
        updatePwdToggle,
        loginData,
        dayCount,
        setUpdatePwdToggle,
        setLoginData,
        setDayCount,
      }}
    >
      <View
        className={styles['container']}
        style={
          safeBottomHeight
            ? {
                paddingBottom: `${safeBottomHeight}PX`,
              }
            : {}
        }
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <View className={styles['head']}>
            <Image src={parameterValue?.logo || logoPng} className={styles['logo']} />
            <View className={styles['logoTitle']}>
              {getValueByLanguage(parameterValue?.welcomeCall) ||
                intl.formatMessage({
                  id: 'user.nihao',
                  defaultMessage: '你好',
                })}
              ,
            </View>
            <View className={styles['logoTitle']}>欢迎来到云链认养鲜</View>
          </View>
          {/* 登录方式 */}
          <View className={styles['LoginType']}>
            {loginTypeText.map((item: any, index: number) => (
              <Text key={index} className={index == current ? styles['ative'] : ''} onClick={() => setCurrent(index)}>
                {item}
              </Text>
            ))}
          </View>
          {renderComponentByType()}
          {current != 0 ? (
            <View className={styles['Loginfoot']}>
              <Text className={styles['left']} onClick={() => setIsOpenToggle(true)}>
                {intl.formatMessage({
                  id: 'user.wangjimima',
                  defaultMessage: '忘记密码',
                })}
              </Text>
              <Text className={styles['right']} onClick={() => Router.navigateTo('user/register')}>
                {intl.formatMessage({
                  id: 'user.kuaisuzhuce',
                  defaultMessage: '快速注册',
                })}
              </Text>
            </View>
          ) : (
            <View className={styles['tips']}>未注册用户，自动注册创建云链认养鲜账号</View>
          )}

          <ModeMobile toggle={toggle} onConfirm={onConfirm} onClose={onClose} />
          {/* 忘记密码 */}
          <ActionSheet isOpened={isOpenToggle} onClose={() => setIsOpenToggle(false)}>
            <View className={styles['contentMain']}>
              <View
                className={styles['title']}
                style={{
                  color: THEME_COLORS.textSecondary,
                }}
              >
                {intl.formatMessage({
                  id: 'user.zhaohuimima',
                  defaultMessage: '找回密码',
                })}
              </View>
              <View className={styles['title']} onClick={() => goJump('phone')}>
                {intl.formatMessage({
                  id: 'user.shoujihaozhaohui',
                  defaultMessage: '手机号找回',
                })}
              </View>
              <View className={styles['title']} onClick={() => goJump('mail')}>
                {intl.formatMessage({
                  id: 'user.youxiangzhaohui',
                  defaultMessage: '邮箱找回',
                })}
              </View>
              <View className={styles['last']} onClick={() => setIsOpenToggle(false)}>
                {intl.formatMessage({
                  id: 'user.quxiao',
                  defaultMessage: '取消',
                })}
              </View>
            </View>
          </ActionSheet>
        </View>
        <View className={styles['agrbox']}>
          <Checkbox checked={agree} size={18} onChange={(checked) => setAgree(checked)} />
          <View className={styles['agrbox-text']}>
            <Text onClick={() => setAgree(!agree)} className={styles['agrbox-consent']}>
              {/* {translate('mobile.resource.user.denglujidaibiao')} */}
              已阅读并同意
            </Text>
            {columnTypeList.map((items: any) => (
              <Text
                key={items.id}
                className={styles['agrbox-signRight']}
                onClick={(e) => {
                  e.stopPropagation()
                  webView(items)
                }}
              >
                {`《${items.title}》`}
              </Text>
            ))}
          </View>
        </View>
        <Modal
          className={styles['password-model']}
          title={intl.formatMessage({
            id: 'user.updatepassword.tips',
            defaultMessage: '您的账号密码已超过{{dayCount}}天未更新，请尽快更新账号密码',
            dayCount,
          })}
          confirmText={intl.formatMessage({
            id: 'user.updatepassword',
            defaultMessage: '更新密码',
          })}
          cancelText={intl.formatMessage({
            id: 'user.updatepassword.cancel',
            defaultMessage: '忽略',
          })}
          isOpened={updatePwdToggle}
          onClose={() => {
            setUpdatePwdToggle(false)
            loginSuccess(shopAndSite, loginData)
          }}
          onCancel={() => {
            setUpdatePwdToggle(false)
            loginSuccess(shopAndSite, loginData)
          }}
          onConfirm={() => {
            setUpdatePwdToggle(false)
            onUpdatePassword()
          }}
        />
      </View>
    </LoginContext.Provider>
  )
}
export default GlobalWrapper(Login)
