import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@apps/mobile-ui'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { setAsyncStorage, getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import { ROLE_LIST, IDS_DATA } from '@/constants/storage'
import { JumpLike } from '../utils'
import Progress from '../components/progress'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const businessTypes = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const [List, setList] = useState<any>([])
  /* 会员id */
  const [ids, setIds] = useState<any>({
    memberType: '',
    memberRoleId: '',
  })
  const submit = async () => {
    setAsyncStorage(IDS_DATA, ids)
    JumpLike(3)
  }
  // 获取身份
  const getBusinessType = async () => {
    const list = await getAsyncStorage(ROLE_LIST)
    const { memberType, memberRoleVOList } = list
    const data = {
      memberType: memberType,
      memberRoleId: memberRoleVOList[0].memberRoleId,
    }
    setIds(data)
    setList(memberRoleVOList)
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.zhanghaozhuce', defaultMessage: '帐号注册' }) })
    getBusinessType()
  }, [])
  const tagClick = (index) => {
    const list = [...List]
    list.forEach((item: any) => {
      const objItem = item
      objItem.Type = false
    })
    list[index].Type = true
    setList(list)
    const id = {
      memberType: ids.memberType,
      memberRoleId: list[index].memberRoleId,
    }
    setIds(id)
    setAsyncStorage(IDS_DATA, id)
  }
  return (
    <View
      className={styles['container']}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(16),
      }}
    >
      <Progress setp={3} />
      <View className={styles['InfoName']}>
        {intl.formatMessage({
          id: 'user.qingxuanzehuiyuanjuese',
          defaultMessage: '请选择您的会员角色',
        })}
      </View>
      <ScrollView
        className={styles['list']}
        data={List}
        numColumns={2}
        contentContainerStyle={{
          width: '100%',
        }}
        renderItem={({ item, index }) => (
          <View key={item} className={item.Type ? styles['itemAtive'] : styles['item']} onClick={() => tagClick(index)}>
            <View className={styles['memberTypeName']}>{item.memberRoleName}</View>
          </View>
        )}
      />
      <View className={styles['foot']}>
        <View className={styles['btn']} onClick={submit}>
          {intl.formatMessage({
            id: 'user.jixuwanshanshangjiarenzheng',
            defaultMessage: '继续完善商家认证',
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
export default GlobalWrapper(businessTypes)
