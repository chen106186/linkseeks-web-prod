import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { getCurrentInstance, preload, pxTransform, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, ScrollView, Image } from '@apps/mobile-ui'
import { getMemberMobileSecurityGet } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import { getAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { SECURITY_GET, USER_INFO } from '@/constants/storage'
import { decryptedByAES } from '@linkseeks/crypto'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const mailbox = getOssUrlPath('/miniprogram/assets/images/icon-mailbox.png')
const phone = getOssUrlPath('/miniprogram/assets/images/icon-phone.png')
const payment = getOssUrlPath('/miniprogram/assets/images/icon-payment.png')
const iconright = getOssUrlPath('/miniprogram/assets/images/arrow-ios-right.png')
export type nameType = 'phone' | 'email' | 'paycode'
export type JumpParams = {
  name: nameType
  value: string | null
}
const Verifys: React.FC = (props) => {
  const route: {
    params: any
  } = {
    params: getCurrentInstance().router?.params,
  }
  const intl = useIntl()
  const { type } = route.params
  const [methods, setMethods] = useState<any>([])
  const handleJumpTo = (data: JumpParams) => {
    preload({
      type,
      verify: data,
    })
    Router.redirectTo('basicSetting/capture')
  }
  const getInfo = async () => {
    const data = await getAsyncStorage(SECURITY_GET)
    const userData = await getAsyncStorage(USER_INFO)
    const mixData = (mixData) => {
      return [
        {
          key: intl.formatMessage({
            id: 'user.tongguoshoujiyanzhengmayan',
            defaultMessage: '通过手机验证码验证身份',
          }),
          value: mixData.phone,
          dataIndex: 'phone',
          icon: phone,
        },
        {
          key: intl.formatMessage({
            id: 'user.tongguoyouxiangyanzhengmayan',
            defaultMessage: '通过邮箱验证码验证身份',
          }),
          value: mixData.email,
          dataIndex: 'email',
          icon: mailbox,
        },
        {
          key: intl.formatMessage({
            id: 'user.tongguoshuruzhifumima',
            defaultMessage: '通过输入支付密码验证身份',
          }),
          value: mixData.hasPayPassword
            ? intl.formatMessage({
                id: 'user.zhifumimayanzheng',
                defaultMessage: '支付密码验证',
              })
            : '',
          dataIndex: 'paycode',
          icon: payment,
        },
      ]
    }
    if (!data || data.userId !== userData.userId) {
      getMemberMobileSecurityGet().then((res) => {
        if (res.code === 1000) {
          const _data = {
            ...res.data,
            phone: res.data?.phone ? decryptedByAES(res.data?.phone) : undefined,
            email: res.data?.email ? decryptedByAES(res.data?.email, false) : undefined,
          }
          setAsyncStorage(SECURITY_GET, _data)
          setMethods(mixData(_data))
        }
      })
    } else {
      setMethods(mixData(data))
    }
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.shenfenyanzheng', defaultMessage: '身份验证' }) })
    getInfo()
  }, [])
  return (
    <View className={styles['page']}>
      <ScrollView className={styles['scroll-view']}>
        <View className={styles['section']}>
          <Text className={styles['sm-text']}>
            {intl.formatMessage({
              id: 'user.weilebaozhangnindezhanghao',
              defaultMessage: '为了保障您的账号安全',
            })}
          </Text>
          <Text className={styles['lg-text']}>
            {intl.formatMessage({
              id: 'user.jinhangcaozuoqianxuyanzheng',
              defaultMessage: '进行操作前需验证身份',
            })}
          </Text>
        </View>
        <View className={styles['panel']}>
          <Text className={styles['head']}>
            {intl.formatMessage({
              id: 'user.qingxuanzeyizhongyanzhengfang',
              defaultMessage: '请选择一种验证方式',
            })}
          </Text>
          {methods.map((item: any) => {
            if (item.value) {
              return (
                <View
                  className={styles['touch']}
                  key={item.value}
                  onClick={() =>
                    handleJumpTo({
                      name: item.dataIndex as nameType,
                      value: item.value,
                    })
                  }
                >
                  <View className={styles['panel-item']}>
                    <View
                      style={{
                        display: 'flex',
                      }}
                    >
                      <View className={styles['icon']}>
                        <Image src={item.icon} className={styles['icon']} />
                      </View>
                      <View className={styles['values']}>
                        <Text className={styles['phone']}>{item.value}</Text>
                        <Text className={styles['type']}>{item.key}</Text>
                      </View>
                    </View>
                    {/*  */}
                    <Image
                      src={iconright}
                      style={{
                        width: pxTransform(24),
                        height: pxTransform(24),
                      }}
                    />
                  </View>
                </View>
              )
            }
            return null
          })}
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(Verifys)
