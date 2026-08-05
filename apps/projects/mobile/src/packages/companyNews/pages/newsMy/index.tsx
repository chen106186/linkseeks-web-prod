import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, Upload } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { observer } from 'mobx-react-lite'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { postMemberMobileBusinessLogoAdd } from '@apps/apis'
// import { GlobalConfig } from "@/constants/global"
import useCustomerService from '@/hooks/useCustomerService'
import Router from '@/utils/router'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import Newstab from '../../components/newsTab/index'
import styles from './index.module.scss'
interface Iprops {}
interface navigationListProps {
  icon: string
  name: string
  url: any
}

// const { customerServiceInfo } = GlobalConfig.global
const customerServiceInfo = {}
const MyInfo = (props: Iprops) => {
  const {
    userStore: { userInfo },
  } = useStores()
  const intl = useIntl()
  const { routerToCustomerService } = useCustomerService()
  const navigationList = [
    {
      icon: getOssUrlPath('/Images/Collection.svg'),
      name: intl.formatMessage({
        id: 'companyNews.shoucang',
        defaultMessage: '收藏',
      }),
      url: 'collection',
    },
    {
      icon: getOssUrlPath('/Images/History.svg'),
      name: intl.formatMessage({
        id: 'companyNews.lishi',
        defaultMessage: '历史',
      }),
      url: 'newsHistoryList',
    },
    {
      icon: getOssUrlPath('/Images/Help.svg'),
      name: intl.formatMessage({
        id: 'companyNews.bangzhuxinxi',
        defaultMessage: '帮助信息',
      }),
      url: 'HelpCenter',
    },
  ]
  customerServiceInfo?.id &&
    navigationList.push({
      icon: getOssUrlPath('/Images/Customer.svg'),
      name: intl.formatMessage({
        id: 'companyNews.zaixiankefu',
        defaultMessage: '在线客服',
      }),
      url: 'customerService',
    })
  const [name, setName] = useState<string | undefined>('')
  const [phone, setphone] = useState<string | undefined>('')
  const [userImg, setlogo] = useState<string | undefined>('')

  /* 获取用户信息 */
  const getUserInfo = () => {
    setphone(userInfo?.phone)
    setlogo(userInfo?.logo)
    setName(userInfo?.userName)
  }
  const Jump = (url: string) => {
    if (url) {
      if (url === 'collection') {
        Router.navigateTo(`members/collection`, {
          mode: '3',
        })
      } else if (url === 'customerService') {
        routerToCustomerService()
      } else {
        url === 'HelpCenter' ? Router.navigateTo(`basicSetting/${url}`) : Router.navigateTo(`companyNews/${url}`)
      }
    }
  }
  useEffect(() => {
    getUserInfo()
  }, [])
  // @TODO:  上传文件
  const uplaodFile = async (result) => {
    const uploadResult = await uploadFileRequest([result[0]])
    if (uploadResult.length > 0) {
      const item = uploadResult[0]
      // @tofix api
      const { data, code } = await postMemberMobileBusinessLogoAdd({
        logo: item.uri,
      })
      if (code === 1000) {
        setlogo(item.url)
      }
    }
    return uploadResult
  }
  return (
    <Newstab mySel="newsMy">
      <View className={styles['news-my-container']}>
        <View className={styles['header']}>
          <Upload actions={uplaodFile} pickerMax={1}>
            <View className={styles['section']}>
              <Image className={styles['img']} src={userImg ? `${userImg}` : getOssUrlPath(`/Images/icon.png`)} />
              <Text className={styles['name']}>
                {name ||
                  intl.formatMessage({
                    id: 'companyNews.youke',
                    defaultMessage: '游客',
                  })}
              </Text>
              <Text className={styles['phone']}>{phone || ''}</Text>
            </View>
          </Upload>
        </View>
        <View className={styles['navigation-list']}>
          <View className={styles['menu']}>
            {navigationList.map((item: navigationListProps, i: number) => (
              <View onClick={() => Jump(item.url)} key={`${item.name}_${i}`}>
                <View className={styles['navigation-list-item']}>
                  <View className={styles['box']}>
                    <Image
                      src={`${item.icon}`}
                      style={{
                        width: pxTransform(16),
                        height: pxTransform(16),
                      }}
                    />
                    <Text className={styles['box-name']}>{item.name}</Text>
                  </View>
                  <Image
                    src={getOssUrlPath(`/Images/Rgiht.svg`)}
                    style={{
                      width: pxTransform(10),
                      height: pxTransform(10),
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Newstab>
  )
}
export default GlobalWrapper(observer(MyInfo))
