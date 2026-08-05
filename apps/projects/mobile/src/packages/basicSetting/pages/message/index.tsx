import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import cx from 'classnames'
import { useDidShow, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView, Toast, Image } from '@apps/mobile-ui'
import MallTabBottom from '@/components/MallTabBottom'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { getSupportMobileMessageUnreadCount } from '@apps/apis'
import { big } from './common/images'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
import { THEME_COLORS } from '@/constants/theme'
const iconRight = getOssUrlPath('/miniprogram/assets/images/icon-right.svg')
const Message = () => {
  const $router = getCurrentInstance()
  const { hasTab, layoutType } = $router.router?.params || {}
  const intl = useIntl()
  const MSG_TYPE = [
    intl.formatMessage({
      id: 'mine.xitonggonggao',
      defaultMessage: '系统公告',
    }),
    intl.formatMessage({
      id: 'mine.jiaoyitongzhi',
      defaultMessage: '交易通知',
    }),
    intl.formatMessage({
      id: 'mine.caigoutongzhi',
      defaultMessage: '采购通知',
    }),
    intl.formatMessage({
      id: 'mine.shouhoutongzhi',
      defaultMessage: '售后通知',
    }),
    intl.formatMessage({
      id: 'mine.zijintongzhi',
      defaultMessage: '资金通知',
    }),
    intl.formatMessage({
      id: 'mine.xiaoxitixing',
      defaultMessage: '消息提醒',
    }),
  ]
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'mine.xitongxiaoxi', defaultMessage: '系统消息' }) })
  }, [])
  const [msgList, setMsgList] = useState<any>({
    systemMessage: '',
    systemUnread: 0,
    tradeMessage: '',
    tradeUnread: 0,
    purchaseMessage: '',
    purchaseUnread: 0,
    afterSaleMessage: '',
    afterSaleUnread: 0,
    capitalMessage: '',
    capitalUnread: 0,
    noticeMessage: '',
    noticeUnread: 0,
  })

  // const total = useMemo(
  //   () => list.reduce((prev, current) => {
  //     const sum = prev + msgList[current as "systemUnread"];
  //     return sum;
  //   }, 0), [msgList],
  // );

  const typesData = [
    {
      type: 0,
      color: '#6C9CEB',
      dataIndex: 'system',
    },
    {
      type: 1,
      color: '#F9578B',
      dataIndex: 'trade',
    },
    {
      type: 2,
      color: THEME_COLORS.primary,
      dataIndex: 'purchase',
    },
    {
      type: 3,
      color: '#FF911B',
      dataIndex: 'afterSale',
    },
    {
      type: 4,
      color: '#2CABF7',
      dataIndex: 'capital',
    },
    {
      type: 5,
      color: '#4A6CE8',
      dataIndex: 'notice',
    },
  ]
  const fetchMsg = useCallback(async () => {
    const { data, message, code } = await getSupportMobileMessageUnreadCount()
    if (code !== 1000) {
      Toast.show({
        title: intl.formatMessage({
          id: `${code}`,
          defaultMessage: message,
        }),
        icon: 'none',
      })
      return
    }
    setMsgList(data)
    // const total = list.reduce((prev, current) => {
    //   const sum = prev + msgList[current as "systemUnread"];
    //   return sum;
    // }, 0);
    // setTotalMsg(total);
  }, [])
  useDidShow(() => {
    fetchMsg()
  })
  const handleJump = (type: number) => {
    Router.navigateTo('basicSetting/platformMsg', {
      type,
      title: MSG_TYPE[type],
    })
  }

  // const handleReadAll = async () => {
  //   if (total === 0) {
  //     Toast.show({ title: "没有可清除的消息" });
  //     return;
  //   }
  //   // Confirm.info({
  //   //   title: "提示",
  //   //   content: "是否清除所有未读消息",
  //   //   onOk: () => new Promise<void>((resolve) => {
  //   //     postMessageMobileMessageMemberReadAll()
  //   //       .then((res) => {
  //   //         if (res.code !== 1000) {
  //   //           Toast.show(intl.formatMessage({id: `${res.code}`, defaultMessage: res.message});
  //   //           return;
  //   //         }
  //   //         const newData: any = {};
  //   //         list.forEach((_item) => {
  //   //           newData[_item] = 0
  //   //         })
  //   //         setMsgList((prev) => ({
  //   //           ...prev,
  //   //           ...newData,
  //   //         }))
  //   //         resolve();
  //   //       })
  //   //   }),
  //   // })
  // }

  // const HeaderExtra = (<Text className='extra-text' onClick={handleReadAll}>{`全部未读(${total})`}</Text>)

  return (
    <MallTabBottom layoutType={layoutType as LAYOUT_TYPE} visible={hasTab === 'true'} activeUrl="basicSetting/message">
      <View className={styles['page']}>
        <ScrollView className={styles['scroll-view']}>
          {typesData.map((item) => {
            const messageKey = `${item.dataIndex}Message`
            const messageUnreadKey = `${item.dataIndex}Unread`
            const unReadCount = msgList[messageUnreadKey]
            return (
              <View className={styles['section']} onClick={() => handleJump(item.type)} key={item.type}>
                <View className={styles['msg-icon']}>
                  <Image src={big[item.type]} className={styles['icon']} />
                </View>
                <View className={styles['content']}>
                  <Text className={styles['msg-type']}>{MSG_TYPE[item.type]}</Text>
                  <Text className={styles['desc']}>{msgList[messageKey]}</Text>
                </View>
                <View className={cx(styles['right'], unReadCount === 0 ? styles['layout-right'] : '')}>
                  {msgList[messageUnreadKey] > 0 && (
                    <View className={styles['no-read']}>
                      <Text className={styles['count']}>{msgList[messageUnreadKey]}</Text>
                    </View>
                  )}
                  <Image className={styles['icon-right']} src={iconRight} />
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(Message)
