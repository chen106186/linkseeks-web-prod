import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Button, Text, CheckboxGroup, Checkbox, Radio, ScrollView, Toast } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import { checkMore } from '@/utils'
import Loading from '@/components/Loading'
import ImageBox from '@/components/ImageBox'
import { getCurrentInstance, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { getMemberManagePlatformProviderPage, GetMemberManagePlatformProviderPageResponseDetail } from '@apps/apis'
import styles from './index.module.scss'
import { useMobileIntl } from '@apps/locales'
import { THEME_COLORS } from '@/constants/theme'
interface ListParams {
  /**
   * 每页行数
   */
  pageSize?: number
  /**
   * 商品名称
   */
  name?: string
}
const SupplierList = () => {
  const [keyword, setKeyword] = useState<string>()
  const [memberList, setMemberList] = useState<GetMemberManagePlatformProviderPageResponseDetail[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const PAGE_SIZE = 8
  const translate = useMobileIntl()
  const params = getCurrentInstance().preloadData as {
    preloadDate: any
    ids: number[]
    onSelect: (selectList: GetMemberManagePlatformProviderPageResponseDetail[]) => void
  }
  const { onSelect, ids, preloadDate } = params || {}
  const [selectIds, setSelectIds] = useState<number[]>(ids || [])
  const handleSearch = (keyword: string) => {
    if (keyword) {
      setKeyword(keyword)
    } else {
      setKeyword('')
    }
  }
  const getProductList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const payload: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        lifeCycleStageRuleId: 1,
        ...(searchValue.current || {}),
      }
      getMemberManagePlatformProviderPage(payload)
        .then((res) => {
          if (res.code === 1000) {
            setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  useEffect(() => {
    pageRef.current = 1
    searchValue.current = {
      name: keyword || '',
    }
    getProductList()
      .then((res) => {
        setMemberList(res)
      })
      .catch(() => {})
  }, [keyword])
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getProductList()
      .then((res) => {
        setMemberList(memberList.concat(res))
      })
      .catch(() => {})
  }
  const handleConfirm = () => {
    if (selectIds && selectIds.length > 0) {
      const list: GetMemberManagePlatformProviderPageResponseDetail[] = []
      for (const id of selectIds) {
        const memberItem = memberList.find((item) => item.memberId === id)
        if (memberItem) {
          list.push(memberItem)
        }
      }
      onSelect?.(list)
      preload({
        ...preloadDate,
      })
      Router.navigateBack()
    } else {
      Toast.show({
        title: translate('mobile.resource.askPurchase.qingxuanzegongyingshang'),
        icon: 'none',
      })
    }
  }
  return (
    <View>
      <PageLayout
        style={{
          height: '100vh',
        }}
        renderHeader={
          <>
            <NavBar
              title={
                <Search
                  placeholder={translate('mobile.resource.askPurchase.gongyingshang')}
                  onSearch={handleSearch}
                  onClear={(val) => setKeyword(val)}
                  innerBackground={THEME_COLORS.page}
                  customClassName={styles['page-wrap-search-key']}
                  shape="round"
                  clearable
                />
              }
              greedy
            />
          </>
        }
      >
        {() => (
          <View className={styles['sku-list']}>
            <ScrollView className={styles['sku-list-scrollView']} onScrollToLower={handleLoadMore} scrollY>
              <CheckboxGroup
                className={styles['sku-list-radio-group']}
                value={selectIds}
                onChange={(val: number[]) => setSelectIds(val)}
              >
                {memberList &&
                  memberList.length > 0 &&
                  memberList.map((memberItem) => (
                    <View className={styles['sku-list-item']} key={memberItem.memberId}>
                      <View className={styles['sku-list-item-left']}>
                        <ImageBox source={memberItem.logo} width={58} height={58} borderRadius={4} />
                      </View>
                      <View className={styles['sku-list-item-right']}>
                        <Text className={styles['sku-list-item-name']}>{memberItem.name}</Text>
                        <View
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 8,
                          }}
                        >
                          <Text className={styles['sku-list-item-id']}>ID:{memberItem.memberId}</Text>
                          {memberItem.levelTag && (
                            <View className={styles['sku-list-item-levelTag']}>{memberItem.levelTag}</View>
                          )}
                        </View>
                      </View>
                      <Checkbox
                        size={18}
                        value={memberItem.memberId}
                        style={{
                          paddingLeft: 24,
                        }}
                      />
                    </View>
                  ))}
              </CheckboxGroup>
              <Loading loading={loading} noMore={!hasMore} />
            </ScrollView>
            <View className={styles['button-wrap']} onClick={handleConfirm}>
              <Button type="primary">{translate('mobile.common.confirm')}</Button>
            </View>
          </View>
        )}
      </PageLayout>
    </View>
  )
}
export default GlobalWrapper(observer(SupplierList))
