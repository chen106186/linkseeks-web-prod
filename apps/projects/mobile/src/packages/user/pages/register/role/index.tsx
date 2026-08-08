import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import {
  setNavigationBarTitle,
  showToast,
  pxTransform,
  getStorageSync,
  getCurrentPages,
} from '@apps/mobile-services/utils/taro'
import { setAsyncStorage, getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { ROLE_LIST, TOKEN, USER_INFO } from '@/constants/storage'
import { postMemberMobileLoginRoleSwitch } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const avatar = getOssUrlPath('/miniprogram/assets/images/default_avatar.png')
const Role = () => {
  const { safeBottomHeight } = useSafeArea()
  const [dataSouse, setDataSource] = useState([])
  const [Index, setIndex] = useState<number>(0)
  const [roleId, setRoleId] = useState<any>()
  const { userStore } = useStores()
  const { shopAndSite } = userStore
  const intl = useIntl()
  const getRoleList = async () => {
    let roleList = await getAsyncStorage(ROLE_LIST)
    if (roleList && roleList.length > 0) {
      setRoleId(roleList[0].roleId)
      setDataSource(roleList)
    }
  }
  const getHome = async () => {
    const res = await postMemberMobileLoginRoleSwitch({
      roleId,
      shopType: 1,
    })
    if (res.code === 1000) {
      setAsyncStorage(TOKEN, res.data.token)
      setAsyncStorage(USER_INFO, res.data)
      // 根据商城类型判断需要跳转的路径
      userStore.setUserInfo(res.data)
      if (shopAndSite?.isSelf) {
        Router.reLaunch('extra/mall/own')
      } else {
        Router.reLaunch('extra/mall/b2b')
      }
    } else {
      showToast({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
        icon: 'none',
      })
    }
  }
  const check = (index: number, id: any) => {
    setRoleId(id)
    setIndex(index)
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.xuanzejuese', defaultMessage: '选择角色' }) })
    getRoleList()
  }, [])
  return (
    <View
      className={styles['container']}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(16),
      }}
    >
      <View className={styles['RoleName']}>
        {intl.formatMessage({
          id: 'user.nindejueseshi',
          defaultMessage: '您的角色是?',
        })}
      </View>
      <View className={styles['RoleText']}>
        {intl.formatMessage({
          id: 'user.womenhuigenjuxuanzewei',
          defaultMessage: '我们会根据选择为您提供精准服务',
        })}
      </View>
      <View className={styles['RoleList']}>
        {dataSouse.map((item: any, index: number) => (
          <View
            key={index}
            className={Index == index ? styles['RoleListItemAtive'] : styles['RoleListItem']}
            onClick={() => check(index, item.roleId)}
          >
            <Image src={avatar} />
            <Text>{item.roleName}</Text>
          </View>
        ))}
      </View>
      <View className={styles['foot']}>
        <View className={styles['btn']} onClick={getHome}>
          {intl.formatMessage({
            id: 'user.queding',
            defaultMessage: '确定',
          })}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(Role)
