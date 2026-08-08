import React, { useState, useEffect } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { checkMore } from '@/utils'
import Loading from '@/components/Loading'
import Empty from '@/components/Empty'
import { ScrollView, View } from '@apps/mobile-ui'
import {
  getMemberMobileInfoDetailLevelHistoryPage,
  getMemberMobileInfoDetailRightHistoryPage,
  getMemberMobileInfoDetailRightSpendHistoryPage,
  getMemberMobileInfoShopLevelHistoryPage,
  getMemberMobileInfoShopRightHistoryPage,
  getMemberMobileInfoShopRightSpendHistoryPage,
} from '@apps/apis'
import useStores from '@/store/useStores'
import PowerRecordItem, { ItemData } from '../../components/PowerRecordItem'
import styles from './index.module.scss'

let PAGE_SIZE = 10

interface MemberListParams {
  /**
   * 当前页
   */
  current?: string
  /**
   * 每页行数
   */
  pageSize?: string
}

interface LevelHistoryProps {
  /**
   * 会员Id
   */
  upperMemberId: string
  /**
   * 会员角色Id
   */
  upperRoleId: string
  /** 是否为店铺会员** */
  isShop?: boolean
  LevelHistory?: boolean
  RightHistory?: boolean
  RightSpendHistory?: boolean
}

const ShowHistory: React.FC<LevelHistoryProps> = (props: LevelHistoryProps) => {
  const { upperMemberId, upperRoleId, isShop, LevelHistory, RightHistory, RightSpendHistory } = props
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [rightList, setRightList] = useState<ItemData[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  /* 获取数据 */
  const getRightList = (params?: MemberListParams): Promise<ItemData[]> => {
    if (loading || !hasMore) {
      return Promise.reject()
    }
    const nextPage = params?.current || page
    setLoading(true)
    return new Promise((resolve, reject) => {
      let api: any = getMemberMobileInfoDetailLevelHistoryPage
      if (RightHistory) {
        api = getMemberMobileInfoDetailRightHistoryPage
      }
      if (RightSpendHistory) {
        api = getMemberMobileInfoDetailRightSpendHistoryPage
      }
      let param: any = {
        shopType: 1,
        self: shopAndSite?.isSelf ? 1 : 0,
        current: `${nextPage}`,
        pageSize: `${PAGE_SIZE}`,
      }
      if (!!upperMemberId) {
        param.upperMemberId = upperMemberId
        param.upperRoleId = upperRoleId
      }
      if (!!isShop) {
        api = getMemberMobileInfoShopLevelHistoryPage
        if (RightHistory) {
          api = getMemberMobileInfoShopRightHistoryPage
        }
        if (RightSpendHistory) {
          api = getMemberMobileInfoShopRightSpendHistoryPage
        }
        param = {
          current: `${nextPage}`,
          pageSize: `${PAGE_SIZE}`,
        }
        if (!!upperMemberId) {
          param.upperMemberId = upperMemberId
          param.upperRoleId = upperRoleId
        }
      }
      api(param)
        .then((res: { code: number; data: { data: any[]; totalCount: number } }) => {
          if (res.code === 1000) {
            let { data } = res.data
            if (LevelHistory) {
              data = res.data.data.map(
                (item: { id: any; ruleName: any; createTime: any; score: any; remark: any }) => ({
                  id: item.id,
                  rightTypeName: item.ruleName,
                  createTime: item.createTime,
                  point: item.score,
                  remark: item.remark,
                }),
              )
            }
            setHasMore(checkMore(+nextPage, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(data)
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
    getRightList()
      .then((res) => {
        setRightList(rightList.concat(res))
      })
      .catch(() => {})
  }, [page])

  // const getMore = () => {
  //   PAGE_SIZE = 15;
  //   setIsFlatList(!isFlatList);
  //   handleLoadMore()
  // };
  /* 滚动列表 */
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={{ marginBottom: pxTransform(8), width: '100%' }} key={item.id}>
      <PowerRecordItem data={item} border={index !== rightList.length - 1} expended={RightSpendHistory} />
    </View>
  )
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    setPage(page + 1)
    // getRightList()
    //   .then((res) => {
    //     setRightList(rightList.concat(res));
    //   })
    //   .catch(() => {});
  }
  // useEffect(() => {
  //   if (!isFlatList) {
  //     PAGE_SIZE = 3
  //   }
  // }, [isFlatList])

  return (
    <View className={styles.list}>
      <ScrollView
        scrollY
        data={rightList}
        refresherEnabled
        lowerThreshold={1}
        onScrollToLower={handleLoadMore}
        className={styles['scroll-list']}
        renderItem={renderItem}
        listEmptyComponent={<Empty />}
        listFooterComponent={
          rightList.length ? (
            <Loading loading={loading} noMore={hasMore} customStyle={{ marginTop: pxTransform(24) }} />
          ) : null
        }
      ></ScrollView>
    </View>
  )
}

export default ShowHistory
