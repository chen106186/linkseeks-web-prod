import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Image } from '@apps/mobile-ui'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import { BUSINESS_TYPES } from '@/constants/storage'
import { getMemberMobileRegisterType } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import { JumpLike } from '../utils'
import Progress from '../components/progress'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const userImg = getOssUrlPath('/miniprogram/assets/images/id.png')
const Identity = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const [List, setList] = useState<any>([])
  const submit = async () => {
    JumpLike(2)
  }
  // 获取身份
  const getRegisterType = async () => {
    const res: any = await getMemberMobileRegisterType()
    if (res.code === 1000) {
      const list = res.data
      list.forEach((element: any) => {
        const item = element
        item.Type = false
      })
      if (list) {
        list[0].Type = true
      }
      setAsyncStorage(BUSINESS_TYPES, list[0])
      setList(list)
    }
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.zhanghaozhuce', defaultMessage: '帐号注册' }) })
    getRegisterType()
  }, [])
  const tagClick = (index) => {
    const list = [...List]
    list.forEach((item: any) => {
      const objItem = item
      objItem.Type = false
    })
    list[index].Type = true
    setList(list)
    setAsyncStorage(BUSINESS_TYPES, list[index])
  }
  return (
    <View
      className={styles['container']}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(16),
      }}
    >
      <Progress setp={2} />
      <View className={styles['InfoName']}>
        {intl.formatMessage({
          id: 'user.qingxuanzenindeshenfen',
          defaultMessage: '请选择您的身份',
        })}
      </View>
      <View className={styles['list']}>
        {List.map((item: any, index: number) => {
          return (
            <View
              key={item}
              className={item.Type ? styles['itemAtive'] : styles['item']}
              onClick={() => tagClick(index)}
            >
              <Image src={userImg} />
              <View className={styles['memberTypeName']}>{item.memberTypeName}</View>
            </View>
          )
        })}
      </View>
      <View className={styles['foot']}>
        <View className={styles['btn']} onClick={submit}>
          {intl.formatMessage({
            id: 'user.xiayibu',
            defaultMessage: '下一步',
          })}
        </View>
      </View>
      <View className={styles['goBack']} onClick={() => Router.navigateBack()}>
        {intl.formatMessage({
          id: 'common.returnToPreviousStep',
          defaultMessage: '返回上一步',
        })}
      </View>
    </View>
  )
}
export default GlobalWrapper(Identity)
