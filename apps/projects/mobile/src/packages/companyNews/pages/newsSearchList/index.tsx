import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { View, Icons, Input, ScrollView } from '@apps/mobile-ui'
import { getCurrentInstance, pxTransform } from '@apps/mobile-services/utils/taro'
import Loading from '@/components/Loading'
import NewsCard from '../../components/newsCard/index'
import { checkMore } from '@/utils'
import { getManageMobileInformationMobileList, getManageMobileMemberInformationMobileList } from '@apps/apis'
import { getCommodityMobileShopMobileCheckShopMemberOperate } from '@apps/apis'
import Header from '@/components/NavBar'
import Search from '@/components/Search'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
type GetListType = {
  // 栏目Id
  columnId?: number
  // 推荐标签 1-头条文章 2-轮播新闻 3-图片新闻 4-推荐阅读 5-行情推荐 6-本栏推荐
  recommendLabel?: string
  // 排序类型：1.按发布时间倒序，2.按推荐排序升序，3.按最新发布排序，4.按最多阅读排序，5.按最多收藏排序
  sortType?: number
  // 三级分类ID
  thirdlyCategoryId?: number
  // 搜索关键词
  keyword?: string
  /* 当前页 */
  current?: number
  /* 页大小 */
  pageSize?: number
}
const PAGE_SIZE = 8
const SearchList = () => {
  const {
    userStore: { shopAndSite },
  } = useStores()
  const params = getCurrentInstance()?.router?.params
  const pageRef = useRef<number>(1)
  // console.log(params, 131321)
  const [keyword, setkeyword] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [firstCategoryList, setFirstCategoryList] = useState<any>([])
  const intl = useIntl()
  /* 获取咨询 */
  const getNewList = (moikdata: GetListType, first?: boolean) => {
    if ((loading || !hasMore) && !first) {
      return
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      getCommodityMobileShopMobileCheckShopMemberOperate({
        shopId: shopAndSite?.id,
      }).then((resj: { data: number }) => {
        let fn: any
        if (resj.data === 1) {
          fn = getManageMobileMemberInformationMobileList
        } else {
          fn = getManageMobileInformationMobileList
        }
        fn({
          current: `${pageRef.current}`,
          pageSize: `${PAGE_SIZE}`,
          ...moikdata,
        })
          .then((res: any) => {
            const { code } = res
            if (code === 1000) {
              if (moikdata.current) {
                pageRef.current = 2
                setFirstCategoryList(res.data.data)
              } else {
                pageRef.current += 1
                setFirstCategoryList([...firstCategoryList, ...res.data.data])
              }
              setHasMore(checkMore(pageRef.current - 1, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
              resolve(res.data.data)
            }
          })
          .catch(() => {
            reject()
          })
          .finally(() => {
            setLoading(false)
          })
      })
    })
  }
  /* 输入关键字 */
  const Submit = (key: string) => {
    setkeyword(key)
    const data = {
      keyword: key,
      ...params,
      sortType: 2,
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
      current: 1,
    }
    getNewList(data, true)
  }
  useEffect(() => {
    if (params?.thirdlyCategoryId) {
      const data = {
        keyword,
        ...params,
        memberId: shopAndSite?.memberId,
        roleId: shopAndSite?.memberRoleId,
        sortType: 2,
        current: 1,
      }
      getNewList(data, true)
    }
  }, [keyword, params])
  return (
    <View className={styles['news-search-container']}>
      <Header
        title={
          <View className={styles['keyword']}>
            <Search
              searchOnClearAction={false}
              placeholder={intl.formatMessage({
                id: 'companyNews.sousuo',
                defaultMessage: '搜索',
              })}
              onSearch={Submit}
              customClassName={styles['sear-input']}
              shape="round"
              clearable
            />
          </View>
        }
        greedy
      />
      {/* 内容 */}
      <ScrollView
        className={styles['home-view']}
        scrollY
        refresherEnabled
        lowerThreshold={1}
        onScrollToLower={() =>
          getNewList({
            keyword,
            ...params,
            sortType: 2,
          })
        }
      >
        <View
          style={{
            height: pxTransform(10),
          }}
        ></View>
        {firstCategoryList?.map((item) => {
          return <NewsCard Item={item} key={item.id} keyword={keyword} />
        })}
        <Loading
          loading={loading}
          noMore={!hasMore}
          noMoreText={intl.formatMessage({
            id: 'companyNews.meiyougengduoshu',
            defaultMessage: '没有更多数据啦~',
          })}
        />
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(SearchList)
