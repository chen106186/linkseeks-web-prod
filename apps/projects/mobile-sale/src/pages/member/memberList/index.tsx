import React, { useRef, useState } from 'react'
import { View } from '@apps/mobile-ui'
import ListScrollView, { UpdateRefType } from '@/components/ListScrollView'
import SearchWrap, { HandleType } from '@/components/SearchWrap'
import { postOrderMobileWechatAppletMemberSalesBindCount } from '@apps/apis'
import { getYearMonth } from '@/utils/date'
import SortWrap, { SortParamsType, SORT_TYPE_VALUE } from './components/SortWrap'
import MemberItemCard from './components/MemberItemCard'
import styles from './index.module.scss'

const MemberList = () => {
  const [countTime, setCountTime] = useState(getYearMonth())
  const scrollRef = useRef<UpdateRefType>()
  const paramsRef = useRef<any>({})

  // 搜索或日期筛选触发回调
  const onSearchWrapBack = (type: HandleType, value: any) => {
    const params: any = {}
    switch (type) {
      case 'search':
        params.memberName = value
        break
      case 'screen':
        params.countTime = value
        setCountTime(value)
        break
    }
    paramsRef.current = {
      ...paramsRef.current,
      ...params,
    }
    scrollRef.current?.updateList(paramsRef.current)
  }

  // 排序栏触发回调
  const onSortWrapBack = (params: SortParamsType) => {
    paramsRef.current = {
      ...paramsRef.current,
      orderCountAsc: SORT_TYPE_VALUE[params.timesSort], // 订单次数排序1-正序2-倒叙
      amountPayableAsc: SORT_TYPE_VALUE[params.moneySort], // 下单金额排序1-正序2-倒叙
    }
    scrollRef.current?.updateList(paramsRef.current)
  }

  const renderItem = ({ item }) => <MemberItemCard itemData={item} countTime={countTime} />
  return (
    <View className={styles['container']}>
      {/* 搜索栏 */}
      <SearchWrap onHandleBack={onSearchWrapBack} />
      {/* 排序栏 */}
      {/* <SortWrap onHandleBack={onSortWrapBack} /> */}
      <ListScrollView
        requestApi={postOrderMobileWechatAppletMemberSalesBindCount}
        renderItem={renderItem}
        initParams={{ countTime }}
        ref={scrollRef}
      />
    </View>
  )
}

export default MemberList
