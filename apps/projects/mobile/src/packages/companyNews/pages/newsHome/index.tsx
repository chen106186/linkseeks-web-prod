import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { View, Text, Icons, Image, Toast } from '@apps/mobile-ui'
import { ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Loading from '@/components/Loading'
import Header from '@/components/NavBar'
import { pxTransform, getCurrentPages } from '@apps/mobile-services/utils/taro'
import { checkMore } from '@/utils'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import useSwitchMall from '@/hooks/useSwitchMall'
import {
  getManageMobileColumnMobileAll,
  getManageMobileInformationMobileList,
  getManageMobileMemberColumnMobileAll,
  getManageMobileMemberInformationMobileList,
  getCommodityMobileShopMobileCheckShopMemberOperate,
} from '@apps/apis'
import { IS_WEB } from '@/constants'
import NewsCard from '../../components/newsCard/index'
import NewsTab from '../../components/newsTab/index'
import styles from './index.module.scss'
const PAGE_SIZE = 8
type CategoryItemType = {
  id: number
  name: string
  imageUrl: string
}
// /* 栏目 */
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
const HomeView = () => {
  const intl = useIntl()
  const {
    userStore: { shopAndSite },
  } = useStores()
  const { fetchMall } = useSwitchMall()
  const swiperRef: any = useRef()
  const pageRef = useRef<number>(1)
  const [firstCategoryList, setFirstCategoryList] = useState<any>([]) // 分类列表
  const [categoryIndex, setCategoryIndex] = useState<number>(0) // 选中栏目值
  const [swiperList, setSwiperList] = useState<any[]>([]) // 广告图
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [list, setList] = useState<any>([]) // 数据集合
  /* 获取广告图 */
  const getManageList = async (moikdata: any) => {
    let fn: any
    if (shopAndSite?.isSelf) {
      const res = await getCommodityMobileShopMobileCheckShopMemberOperate({
        shopId: shopAndSite?.id,
      })
      if (res.data === 1) {
        fn = getManageMobileMemberInformationMobileList
      } else {
        fn = getManageMobileInformationMobileList
      }
    } else {
      fn = getManageMobileInformationMobileList
    }
    fn(moikdata).then((res: any) => {
      const { code } = res
      if (code === 1000) {
        setSwiperList(res.data.data)
      }
    })
  }
  /* 跳过 搜索 */
  const jmnp = () => {
    const NewData = {
      sortType: 1,
    }
    Router.navigateTo('companyNews/newsSearchList', NewData)
  }
  /* 获取咨询 */
  const getNewList = (moikdata: GetListType) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      const params: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        ...moikdata,
      }
      getCommodityMobileShopMobileCheckShopMemberOperate({
        shopId: shopAndSite?.id,
      }).then((resj: { data: number }) => {
        let fn: any
        if (resj.data === 1) {
          fn = getManageMobileMemberInformationMobileList
        } else {
          fn = getManageMobileInformationMobileList
        }
        fn(params)
          .then((res: any) => {
            console.log(moikdata, pageRef.current, PAGE_SIZE, res)
            const { code } = res
            if (code === 1000) {
              setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
              setList(res.data.data)
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
  /* 获取全部栏目 */
  const ColumnMobileAll = async () => {
    let fn: any
    const resj = await getCommodityMobileShopMobileCheckShopMemberOperate({
      shopId: shopAndSite?.id,
    })
    if (resj.data === 1) {
      fn = getManageMobileMemberColumnMobileAll
    } else {
      fn = getManageMobileColumnMobileAll
    }
    fn({
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
    }).then((res: any) => {
      const { code, data } = res
      if (code === 1000) {
        setFirstCategoryList(data)
        if (data && data.length > 0) {
          /* 获取列表 */
          const NewData: any = {
            columnId: data[0]?.id,
            sortType: 1,
            memberId: shopAndSite?.memberId,
            roleId: shopAndSite?.memberRoleId,
          }
          getNewList(NewData)
        }
      }
    })
  }
  const GetData = async () => {
    await ColumnMobileAll()
    /* 获取轮播图 */
    const swiperListData = {
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
      recommendLabel: '2,3',
      sortType: 1,
      current: 1,
      pageSize: 99,
    }
    await getManageList(swiperListData)
  }
  useEffect(() => {
    GetData()
  }, [])
  const handleJump = (item) => {
    if (item.status === 3) {
      Toast.show({
        icon: 'none',
        title: intl.formatMessage({
          id: 'companyNews.zixunyixiajia',
          defaultMessage: '资讯已下架',
        }),
      })
      return
    }
    Router.navigateTo('companyNews/newsInformation', {
      informationId: item.id,
    })
  }
  /* 点击选中栏目值 */
  const handleFilter = (item: CategoryItemType, index: number) => {
    setCategoryIndex(index)
    pageRef.current = 1
    setList([])
    setTimeout(() => {
      const NewData = {
        memberId: shopAndSite?.memberId,
        roleId: shopAndSite?.memberRoleId,
        columnId: firstCategoryList[index].id,
        sortType: 1,
      }
      getNewList(NewData)
        .then((res) => {
          console.log(res, 'haha1')
          // setList(list.concat(res));
        })
        .catch(() => {})
    }, 500)
  }

  /* 下拉加载更多 */
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    const NewData = {
      columnId: firstCategoryList[categoryIndex].id,
      sortType: 1,
    }
    getNewList(NewData)
      .then((res) => {
        setList(list.concat(res))
      })
      .catch(() => {})
  }
  const _renderBanner = useMemo(() => {
    if (swiperList && swiperList.length > 0) {
      return (
        <Swiper ref={swiperRef} autoplay className={styles['news-swiper-warp']} interval={3000} circular>
          {swiperList.map((item: any) => (
            <SwiperItem className={styles['news-swiper-item']} key={item.id} onClick={() => handleJump(item)}>
              <Image mode="widthFix" src={String(item.imageUrl)} className={styles['news-swiper-img']} />
              <View className={styles['news-swiper-title']}>{item.title}</View>
            </SwiperItem>
          ))}
        </Swiper>
      )
    }
    return null
  }, [swiperList])
  const by = async () => {
    let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]
    if (!prevPage) {
      fetchMall()
    } else {
      Router.navigateBack()
    }
  }
  return (
    <NewsTab mySel="newsHome">
      {/* 头部 */}
      <Header
        backIconColor="#5A2A12"
        showExtra={IS_WEB ? false : true}
        title={
          <View className={styles['news-key-word']} onClick={jmnp}>
            <Icons
              name="Search"
              size={18}
              color="#C0C4CC"
              customStyle={{
                marginRight: pxTransform(5),
                marginBottom: pxTransform(4),
              }}
            />
            <Text
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: pxTransform(14),
              }}
            >
              {intl.formatMessage({
                id: 'companyNews.sousuo',
                defaultMessage: '搜索',
              })}
            </Text>
          </View>
        }
        customStyle="background:#00a98f"
        greedy
        back={() => by()}
      />
      {/*  头部栏目 */}
      <View className={styles['news-category-container']}>
        {firstCategoryList && firstCategoryList.length > 0 && (
          <ScrollView scrollX className={styles['category-wrap']} showScrollbar={false}>
            {firstCategoryList.map((item: any, index: number) => (
              <View
                key={item.id}
                className={cx(styles['category-item'], categoryIndex === index && styles.active)}
                // style={{ display: 'inline-block' }}
                onClick={() => handleFilter(item, index)}
              >
                <Text className={categoryIndex === index ? styles['category-text-active'] : styles['category-text']}>
                  {item.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {/* 内容 */}
      <ScrollView className={styles['news-home-view']} scrollY lowerThreshold={1} onScrollToLower={handleLoadMore}>
        {/* 广告图 */}
        {_renderBanner}
        {list?.map((item) => {
          return <NewsCard Item={item} key={item.id} />
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
    </NewsTab>
  )
}
export default GlobalWrapper(observer(HomeView))
