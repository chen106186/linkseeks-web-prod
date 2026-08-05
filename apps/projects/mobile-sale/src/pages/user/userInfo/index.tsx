import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import { getMemberMobileWechatAppletSalesInformation } from '@apps/apis'
import useStores from '@/store/useStores'
import './style.scss'

/* 用户信息 */
const Userinfo = () => {
  const intl = useIntl()
  const {
    userStore: { removeUserInfo },
  } = useStores()
  const [useInfoData, setuseInfoData] = useState<any>({})

  const handleLogout = async () => {
    removeUserInfo()
    Toast.show({ title: intl.formatMessage({ id: 'user.tuichuchenggong', defaultMessage: '退出成功' }), icon: 'none' })
    Router.redirectTo('root/login')
  }

  const getInfo = async () => {
    const res = await getMemberMobileWechatAppletSalesInformation()
    setuseInfoData(res.data)
  }

  useEffect(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.gerenziliao', defaultMessage: '个人资料' }) })
    getInfo()
  }, [])

  const Logout = (
    <View className="logout">
      <View className="logout-btn">
        <Text className="logout-text" onClick={() => handleLogout()}>
          {intl.formatMessage({ id: 'user.tuichudenglu', defaultMessage: '退出登录' })}
        </Text>
      </View>
    </View>
  )
  return (
    <View className="userinfo-container">
      <View className="warp">
        <View className="mian">
          <View className="box">
            <Text className="boxleft">
              {intl.formatMessage({ id: 'user.bangdingshoujihao', defaultMessage: '姓名' })}
            </Text>
            <Text className="boxright">{useInfoData.name}</Text>
          </View>
          <View className="box">
            <Text className="boxleft">{intl.formatMessage({ id: 'user.dengluzhanghao', defaultMessage: '账号' })}</Text>
            <Text className="boxright">{useInfoData?.account}</Text>
          </View>
          <View className="box">
            <Text className="boxleft">{intl.formatMessage({ id: 'user.shenfenzheng', defaultMessage: '角色' })}</Text>
            <Text className="boxright">{useInfoData?.roleName}</Text>
          </View>
          <View className="box">
            <Text className="boxleft">
              {intl.formatMessage({ id: 'user.suoshuzuzhijigou', defaultMessage: '所属组织机构' })}
            </Text>
            <Text className="boxright">{useInfoData?.title}</Text>
          </View>
        </View>
      </View>
      <View className="foot">{Logout}</View>
    </View>
  )
}
export default observer(Userinfo)
