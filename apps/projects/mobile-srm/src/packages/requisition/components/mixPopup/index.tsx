import React, { memo, useRef, useState, useEffect } from 'react'
import { View, Text, ScrollView, Image } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import Popup from '@/components/Popup'
import Search from '@/components/Search'
import GenIndicator from '@/components/GenIndicator'
import { getMemberMobileInfoUsersPage, getMemberOrgSelectOrg, postMemberManageLowerProviderPage } from '@apps/apis'

import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  /**
   * 弹窗类型
   * 1 部门 2 用户 3 供应会员
   */
  type: 1 | 2 | 3
  onChoose: Function
  onClose: Function
  valueId?: number
}

const mixData = {
  1: { title: '选择部门', placeholder: '请输入用户名称/机构/职位', keys: 'id' },
  2: { title: '选择用户', placeholder: '请输入用户名称/机构/职位', keys: 'userId' },
  3: { title: '选择供应会员', placeholder: '请输入供应会员名称', keys: 'memberId' },
}

let flag: boolean = false

const MixPopup: React.FC<PropsType> = (props: PropsType) => {
  const { visible, onClose, onChoose, type, valueId } = props
  const { safeBottomHeight } = useSafeArea()
  const loadMoreLoading = useRef<boolean>(false)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [contentList, setContentList] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>('')

  const handleCheck = (item) => {
    onChoose(item)
    onClose()
  }

  const renderItem = ({ item }: { item: any }) => {
    let _topTitle = ''
    let _botText = ''
    switch (type) {
      case 1:
        _topTitle = `${item.code} ${item.title}`
        _botText = `上级机构：${item.parentTitle}`
        break
      case 2:
        _topTitle = `${item.name} ${item.jobTitle}`
        _botText = `${item.orgName}`
        break
      default:
        _topTitle = `${item.name}`
        _botText = `${item.memberTypeName} ｜ ${item.roleName}`
        break
    }

    return (
      <View
        className={styles['mixPopup-outer-flatList-item']}
        onClick={() => {
          handleCheck(item)
        }}
      >
        <View className={styles['mixPopup-outer-flatList-item-left']}>
          <Text className={styles['mixPopup-outer-flatList-item-left-top']}>{_topTitle}</Text>
          <Text className={styles['mixPopup-outer-flatList-item-left-bottom']}>{_botText}</Text>
        </View>
        <Image
          className={styles['mixPopup-outer-flatList-item-right']}
          src={
            item[mixData[type]['keys']] === valueId
              ? require('@/assets/images/Checked-@2x.png')
              : require('@/assets/images/Default@2x.png')
          }
        />
      </View>
    )
  }

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const param: any = {
      current: currentPage || current,
      pageSize,
    }

    let _func

    switch (type) {
      case 1:
        _func = getMemberOrgSelectOrg
        flag && (param.title = keyword)
        break
      case 2:
        _func = getMemberMobileInfoUsersPage
        flag && (param.keyword = keyword)
        break
      default:
        _func = postMemberManageLowerProviderPage
        flag && (param.name = keyword)
        break
    }

    _func?.({ ...param }).then((res: any) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setContentList([...contentList, ...data])
            loadMoreLoading.current = false
            setNoMoreData(false)
          }
        } else {
          setContentList(data)
          loadMoreLoading.current = false
          if (data.length < pageSize) {
            setNoMoreData(true)
          } else {
            setNoMoreData(false)
          }
        }
      }
    })
  }

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  /** 搜索 */
  const handleSearchSubmit = (val: string) => {
    setKeyword(val)
    setCurrent(1)
    flag = true
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  /** 清除搜索 */
  const handleClearSubmit = (val: string) => {
    setKeyword(val)
    setCurrent(1)
    flag = false
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  useEffect(() => {
    if (visible) {
      fetchContentList(1)
    }
  }, [type, visible])

  return (
    <Popup
      title={mixData[type].title}
      closeable
      visible={visible}
      onClose={() => onClose?.()}
      customStyle={{ height: '70vh' }}
    >
      <View className={styles['mixPopup']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
        <Search
          clearable
          placeholder={mixData[type].placeholder}
          onChange={(value) => setKeyword(value)}
          onSearch={(value) => handleSearchSubmit(value)}
          onClear={(value) => handleClearSubmit(value)}
          customClassName={styles['mixPopup-search']}
        />
        <View className={styles['mixPopup-outer']}>
          <ScrollView
            className={styles['mixPopup-outer-flatList']}
            renderItem={renderItem}
            data={contentList}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            horizontal={false}
            listFooterComponent={<GenIndicator noMoreDate={noMoreDate} />}
            onEndReached={() => {
              loadMoreData()
            }}
          />
        </View>
      </View>
    </Popup>
  )
}

MixPopup.defaultProps = {
  visible: false,
  type: 1,
}

export default memo(MixPopup)
