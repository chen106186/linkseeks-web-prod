import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView } from '@tarojs/components'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Loading from '@/components/Loading'
import Router from '@/utils/router'
import { getManageMobileInformationMobileList, getManageMobileMemberInformationMobileList } from '@apps/apis'
import { getCommodityMobileShopMobileCheckShopMemberOperate } from '@apps/apis'
import { checkMore } from '@/utils'
import Header from '@/components/NavBar'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import Newstab from '../../components/newsTab/index'
import NewsCard from '../../components/newsCard/index'
import styles from './index.module.scss'
const PAGE_SIZE = 8
const Recommend = () => {
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [type, settype] = useState(false)
  const [categoryIndex, setcategoryIndex] = useState<number>(0)
  const [firstCategoryList, setFirstCategoryList] = useState<any>([])
  const pageRef = useRef<number>(1)
  const [list, setList] = useState<any>([]) // 数据集合
  const intl = useIntl()
  const tagList = [
    {
      name: intl.formatMessage({
        id: 'companyNews.zuixinfabu',
        defaultMessage: '最新发布',
      }),
      sortType: 3,
    },
    {
      name: intl.formatMessage({
        id: 'companyNews.zuiduoyuedu',
        defaultMessage: '最多阅读',
      }),
      sortType: 4,
    },
    {
      name: intl.formatMessage({
        id: 'companyNews.zuiduoshoucang',
        defaultMessage: '最多收藏',
      }),
      sortType: 5,
    },
  ]
  const handleJump = (Item: { status: number; id: any }) => {
    if (Item.status === 3) {
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
      informationId: Item.id,
    })
  }

  /* 推荐头部 */
  const getfirstCategoryList = async () => {
    let fn: any
    const resj = await getCommodityMobileShopMobileCheckShopMemberOperate({
      shopId: shopAndSite?.id,
    })
    if (resj.data === 1) {
      fn = getManageMobileMemberInformationMobileList
    } else {
      fn = getManageMobileInformationMobileList
    }
    fn({
      current: 1,
      pageSize: 99,
      recommendLabel: 4,
      sortType: 2,
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
    }).then((res: any) => {
      const { code } = res
      if (code === 1000) {
        setFirstCategoryList(res.data.data)
      }
    })
  }
  const GetList = (moikdata: any) => {
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
  const firstData = () => {
    const data = {
      sortType: tagList[categoryIndex].sortType,
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
      // recommendLabel: 4,
    }
    GetList(data)
    getfirstCategoryList()
  }
  useEffect(() => {
    firstData()
  }, [])

  /* 下拉加载更多 */
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    const data = {
      sortType: tagList[categoryIndex].sortType,
      // recommendLabel: 4,
    }
    GetList(data)
      .then((res) => {
        setList(list.concat(res))
      })
      .catch(() => {})
  }
  const tabClick = (index: number) => {
    setcategoryIndex(index)
    // eslint-disable-next-line no-unneeded-ternary
    settype(index === 0 ? true : false)
    pageRef.current = 1
    setList([])
    setTimeout(() => {
      const data = {
        sortType: tagList[index].sortType,
        memberId: shopAndSite?.memberId,
        roleId: shopAndSite?.memberRoleId,
        // recommendLabel: 4,
      }
      GetList(data)
        .then((res) => {
          // setList(list.concat(res));
        })
        .catch(() => {})
    }, 1000)
  }
  return (
    <Newstab mySel="newsRecommend">
      <Header
        title={
          <Text
            style={{
              lineHeight: pxTransform(60),
              fontSize: pxTransform(14),
              textAlign: 'center',
            }}
          >
            {intl.formatMessage({
              id: 'companyNews.tuijianyuedu',
              defaultMessage: '推荐阅读',
            })}
          </Text>
        }
        customRenderLeft={
          <View
            style={{
              flex: 2,
            }}
          ></View>
        }
      />
      <View className={styles['news-rec-container']}>
        {firstCategoryList && firstCategoryList.length > 0 && (
          <ScrollView scrollX className={styles['category-wrap']}>
            {firstCategoryList?.map((item: any, index: number) => (
              <View key={`${item.id}_${index}`} className={styles['category-item']} onClick={() => handleJump(item)}>
                <Image
                  src={`${item.imageUrl}`}
                  mode="widthFix"
                  style={{
                    width: pxTransform(256),
                    height: pxTransform(144),
                  }}
                />
                <View className={styles['category-name']}>
                  <Text className={styles['category-title']}>{item.title}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        <View className={styles['category-wrap-mian']}>
          {tagList &&
            tagList.map((item: any, index: number) => (
              <View key={item.id} onClick={() => tabClick(index)}>
                <View className={categoryIndex === index ? styles['category-text-active'] : styles['category-text']}>
                  <Text>{item.name}</Text>
                </View>
              </View>
            ))}
        </View>
        <ScrollView
          className={styles['bottom-scroll']}
          scrollY
          // refresherEnabled
          lowerThreshold={1}
          onScrollToLower={handleLoadMore}
        >
          {list?.map((item) => {
            return (
              <NewsCard
                Item={item}
                childrenNode={
                  // eslint-disable-next-line no-nested-ternary
                  <Text
                    style={{
                      fontSize: pxTransform(12),
                      color: categoryIndex === 0 ? '#EF3346' : '#909399',
                    }}
                  >
                    {categoryIndex === 0
                      ? intl.formatMessage({
                          id: 'companyNews.zuixin',
                          defaultMessage: '最新',
                        })
                      : categoryIndex === 1
                      ? `${item.readCount}${intl.formatMessage({
                          id: 'companyNews.yuedu',
                          defaultMessage: '阅读',
                        })}`
                      : `${item.collectCount}${intl.formatMessage({
                          id: 'companyNews.shoucang',
                          defaultMessage: '收藏',
                        })}`}
                  </Text>
                }
                type={type}
                key={item.id}
              />
            )
          })}
          <Loading loading={loading} noMore={!hasMore} />
        </ScrollView>
      </View>
    </Newstab>
  )
}
export default GlobalWrapper(observer(Recommend))
