import React, { useEffect, useState } from 'react'
import { View, Text, Image, Toast } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { setNavigationBarTitle, showToast } from '@apps/mobile-services/utils/taro'
import lingxiIcon from '@/assets/images/lingxi_icon.png'
import ModeMobile from '@/components/Modemobile'
import Router from '@/utils/router'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import { encryptedByAES, decryptedByAES } from '@linkseeks/crypto'
import useStores from '@/store/useStores'
import { postMemberMobileSrmAccountLogin, postMemberMobileSrmPhoneLogin } from '@apps/apis'
import { getManageContentNoticeFindWithOutContent } from '@apps/apis'
import MobileView from './components/Mobile'
import SingView from './components/Sing'
import styles from './index.module.scss'

const Login = () => {
  const intl = useIntl()
  const LoginTypeText = [
    intl.formatMessage({ id: 'user.mimadenglu', defaultMessage: '密码登录' }),
    intl.formatMessage({ id: 'user.shoujihaomadenglu', defaultMessage: '手机号码登录' }),
  ]
  const [current, setcurrent] = useState(0) // 0 是账号密码登录
  const { userStore } = useStores()
  const [toggle, settoggle] = useState<boolean>(false) // 显示手机号模态框
  const [countryCode, setCode] = useState('+86') // 手机区号
  const [phoneLength, setphoneLength] = useState(11) // 手机号码长度
  const [select, setSelect] = useState(false) // 设置协议选中
  const [columnTypeList, setColumnTypeList] = useState<any>([]) // 协议数据

  const renderComponentByType = () => {
    switch (current) {
      case 0:
        return <SingView submit={onSubmit} />
      case 1:
        return <MobileView submit={onSubmit} phoneLength={phoneLength} Confirm={Confirm} countryCode={countryCode} />
      default:
        return null
    }
  }

  const onSubmit = async (data: any) => {
    if (!select) {
      Toast.show({
        title: intl.formatMessage({ id: 'user.login.agreement.tips', defaultMessage: '请阅读并同意相关协议' }),
        icon: 'none',
      })
      return
    }
    let fn: Function | null = null
    let obj: any = {}

    switch (current) {
      case 1:
        fn = postMemberMobileSrmPhoneLogin
        break
      default:
        fn = postMemberMobileSrmAccountLogin
        obj.account = encryptedByAES(data.account)
        obj.password = encryptedByAES(data.password)
        obj.shopType = data.shopType
        break
    }
    fn?.(current == 1 ? data : obj).then((res) => {
      if (res.code === 1000) {
        setAsyncStorage('USER_INFO', res.data)
        userStore.setUserInfo(res.data)
        Router.reLaunch('root/index')
        return
      } else {
        if (current == 1) {
          obj.password = decryptedByAES(obj.password)
        }
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
    })
  }

  const Confirm = (flag) => {
    settoggle(flag)
  }
  const findAllByColumnType = async () => {
    const { code, data, message } = await getManageContentNoticeFindWithOutContent({ columnType: '2' })
    if (code === 1000) {
      setColumnTypeList(data)
    } else {
      showToast({ title: message, icon: 'none' })
    }
  }

  const webView = (item: any) => {
    Router.navigateTo('root/richtext', { id: item.id, type: 'sign' })
  }
  useEffect(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.dengru', defaultMessage: '登入' }) })
    findAllByColumnType()
  }, [])

  /* 选择区号回调 */
  const onConfirm = (item) => {
    setCode(item.value)
    setphoneLength(item.phoneLength)
    settoggle(false)
  }

  /* 关闭 */
  const onClose = (item) => {
    settoggle(item.toggle)
  }
  return (
    <View className={styles['container']}>
      <View className={styles['head']}>
        <Image src={lingxiIcon} className={styles['logo']} />
        <View className={styles['logoTitle']}>{intl.formatMessage({ id: 'user.nihao', defaultMessage: '您好' })},</View>
        <View className={styles['logoTitle']}>
          {intl.formatMessage({ id: 'user.huanyinglaidaolingxiyewuyuanduan', defaultMessage: '欢迎来到瓴犀SRM端' })}
        </View>
      </View>
      {/* 登录方式 */}
      <View className={styles['LoginType']}>
        {LoginTypeText.map((item: any, index: number) => (
          <Text key={index} className={index == current ? styles['ative'] : ''} onClick={() => setcurrent(index)}>
            {item}
          </Text>
        ))}
      </View>

      {renderComponentByType()}

      <ModeMobile toggle={toggle} onConfirm={onConfirm} onClose={onClose} />
      {/* 忘记密码 */}
      <View className={styles['sign']}>
        <Image
          src={select ? require('@/assets/images/Checked-@2x.png') : require('@/assets/images/Default@2x.png')}
          onClick={() => setSelect(!select)}
        />
        <View className={styles['signFlex']}>
          <Text className={styles['signText']}>
            {intl.formatMessage({ id: 'user.yuedubingtongyi', defaultMessage: '阅读并同意' })}
          </Text>
          {columnTypeList.map((items: any) => (
            <Text key={items.id} className={styles['signRight']} onClick={() => webView(items)}>
              《{items.title}》{' '}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}
export default Login
