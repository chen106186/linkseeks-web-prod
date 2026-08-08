import React, { useRef, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { useRouter, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import SearchWrap, { HandleType } from '@/components/SearchWrap'
import { UpdateRefType } from '@/components/ListScrollView'
import ScrollOrder from './components/ScrollOrder'
import styles from './index.module.scss'

const OrderList = () => {
  const intl = useIntl()
  const { memberId, memberRoleId } = useRouter().params
  const scrollOrderRef = useRef<UpdateRefType>()
  const paramsRef = useRef<any>({})

  const onHandleBack = (type: HandleType, value: any) => {
    const param: any = {}
    switch (type) {
      case 'search':
        param.memberName = value
        // 如果从绑定会员跳转过来，即带了 memberId 和 memberRoleId
        // 则搜索结果必定是精确的会员
        // 所以更改搜索框企图搜索其他会员的订单时
        // 则需要清除掉 memberId 和 memberRoleId 两个精确条件
        if (memberId && memberRoleId) {
          param.memberId = ''
          param.memberRoleId = ''
        }
        break
      case 'screen':
        param.month = value
        break
    }
    paramsRef.current = {
      ...paramsRef.current,
      ...param,
    }
    scrollOrderRef.current?.updateList(paramsRef.current)
  }

  useEffect(() => {
    setNavigationBarTitle({
      title: intl.formatMessage({ id: 'title.viewBoundOrders', defaultMessage: '查看绑定订单' }),
    })
  }, [])

  return (
    <View className={styles['container']}>
      <SearchWrap onHandleBack={onHandleBack} useRouterParams />
      <ScrollOrder ref={scrollOrderRef} />
    </View>
  )
}

export default OrderList
