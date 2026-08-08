import React, { useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import SearchWrap, { HandleType } from '@/components/SearchWrap'
import NavBar from '@/components/NavBar'
import { UpdateRefType } from '@/components/ListScrollView'
import Router from '@/utils/router'
import ScrollOrder from './components/ScrollOrder'
import styles from './index.module.scss'

const OrderExamineList = () => {
  const intl = useIntl()
  const scrollOrderRef = useRef<UpdateRefType>()
  const paramsRef = useRef<any>({})

  const onHandleBack = (type: HandleType, value: any) => {
    const param: any = {}
    switch (type) {
      case 'search':
        param.keyword = value
        break
    }
    paramsRef.current = {
      ...paramsRef.current,
      ...param,
    }
    scrollOrderRef.current?.updateList(paramsRef.current)
  }

  return (
    <View className={styles['container']}>
      <NavBar
        title={intl.formatMessage({ id: 'order.orderReview', defaultMessage: '订单审核' })}
        back={() => Router.reLaunch('root/home')}
      />
      <SearchWrap
        hideScreenColumn
        onHandleBack={onHandleBack}
        searchPlaceholder={`${intl.formatMessage({
          id: 'order.orderNumber',
          defaultMessage: '订单号',
        })}/${intl.formatMessage({ id: 'order.memberName', defaultMessage: '会员名称' })}`}
        customStyle={{ paddingRight: pxTransform(4) }}
      />
      <ScrollOrder ref={scrollOrderRef} />
    </View>
  )
}

export default OrderExamineList
