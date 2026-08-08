import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { setNavigationBarTitle, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { View, Image, Text, Toast, Upload } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { postMemberMobileBusinessLogoAdd } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'

/* 用户信息 */
const Userinfo = () => {
  const intl = useIntl()
  const {
    userStore: { userInfo, removeUserInfo, setUserInfo },
    confirmOrderStore: { clearAll },
  } = useStores()
  const [loading, setLoading] = useState<boolean>(false)
  const handleLogout = async () => {
    removeUserInfo()
    clearAll()
    Toast.show({
      title: intl.formatMessage({
        id: 'user.tuichuchenggong',
        defaultMessage: '退出成功',
      }),
    })
    Router.redirectTo('user/login')
  }
  const handleChange = async (value: any[]) => {
    const item = value[0]
    // @tofix api
    const { data, code } = await postMemberMobileBusinessLogoAdd({
      logo: item.url,
    })
    hideLoading()
    if (code === 1000) {
      setUserInfo({
        ...userInfo,
        logo: item.url,
      })
    }
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.gerenziliao', defaultMessage: '个人资料' }) })
  }, [])

  // @TODO:  上传文件
  const uploadFile = async (result) => {
    showLoading()
    const uploadResult = await uploadFileRequest([result[0]])
    if (uploadResult.length > 0) {
      handleChange(uploadResult)
    }
    return uploadResult
  }
  const Logout = (
    <View className={styles['logout']}>
      <View className={styles['logout-btn']}>
        <Text className={styles['logout-text']} onClick={() => handleLogout()}>
          {intl.formatMessage({
            id: 'user.tuichudenglu',
            defaultMessage: '退出登录',
          })}
        </Text>
      </View>
    </View>
  )
  return (
    <View className={styles['userinfo-container']}>
      <View className={styles['warp']}>
        <Upload actions={uploadFile} pickerMax={1}>
          <View className={styles['head']}>
            <View className={styles['section']}>
              <View className={styles['left']}>
                <View className={styles['name']}>
                  <Text className={styles['userinfo-text']}>{userInfo?.userName}</Text>
                  {(userInfo?.jobTitle && <Text className={styles['tag']}>{userInfo?.jobTitle}</Text>) || null}
                </View>
                <Text className={styles['title']}>{userInfo?.orgName}</Text>
              </View>
              {(loading && <View className={cx(styles['img'], styles['loading'])}></View>) || (
                <Image
                  className={styles['img']}
                  src={userInfo?.logo ? userInfo?.logo : getOssUrlPath(`/Images/icon.png`)}
                />
              )}
            </View>
          </View>
        </Upload>
        <View className={styles['mian']}>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({
                id: 'user.bangdingshoujihao',
                defaultMessage: '绑定手机号',
              })}
            </Text>
            <Text className={styles['boxright']}>{`${userInfo?.telCode || ''} ${userInfo?.phone || ''}`}</Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({
                id: 'user.dengluzhanghao',
                defaultMessage: '登录账号',
              })}
            </Text>
            <Text className={styles['boxright']}>{userInfo?.account}</Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({
                id: 'user.suoshuzuzhijigou',
                defaultMessage: '所属组织机构',
              })}
            </Text>
            <Text className={styles['boxright']}>
              {userInfo?.orgName
                ? userInfo!.orgName
                : intl.formatMessage({
                    id: 'user.zanwu',
                    defaultMessage: '暂无',
                  })}
            </Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({
                id: 'user.shenfenzheng',
                defaultMessage: '身份证',
              })}
            </Text>
            <Text className={styles['boxright']}>
              {userInfo?.idCardNo
                ? userInfo?.idCardNo
                : intl.formatMessage({
                    id: 'user.zanwu',
                    defaultMessage: '暂无',
                  })}
            </Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({
                id: 'user.youxiang',
                defaultMessage: '邮箱',
              })}
            </Text>
            <Text className={styles['boxright']}>
              {userInfo?.email
                ? userInfo?.email
                : intl.formatMessage({
                    id: 'user.zanwu',
                    defaultMessage: '暂无',
                  })}
            </Text>
          </View>
        </View>
      </View>
      {/* <View style={Styles.foot}>
        {Logout}
       </View> */}
    </View>
  )
}
export default GlobalWrapper(observer(Userinfo))
