import React,  { useEffect, useState } from 'react';
import { Toast } from '@apps/mobile-ui';
import { userInfoType } from '@/store/userStore/model';
import { postMarketingMobileActivityOrderGroupPurchaseList, PostMarketingMobileActivityOrderGroupPurchaseListResponseDetail } from '@apps/apis';
import { useIntl } from '@linkseeks/i18n';

type OptionType = {
  commodityId: number,
  initPageSize: number,
  visible: boolean,
  userInfo?: userInfoType | null,
}

function useGetTeamData(options: OptionType) {
  const userInfo = options.userInfo || null
  const [teamList, setTeamList] = useState<PostMarketingMobileActivityOrderGroupPurchaseListResponseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const intl = useIntl()
  const getData = async ({ current, pageSize }: { current: number, pageSize: number }, isMount: boolean) => {
    setLoading(true)
    try {
      const { data, code, message } = await postMarketingMobileActivityOrderGroupPurchaseList({
        productId: options.commodityId,
        current,
        pageSize: pageSize || 10,
      })
      console.log("data", data);
      if (code === 1000) {
        const newData = isMount ? data.data : teamList.concat(data.data);
        // const newData = teamList.concat(data.data);
        // unstable_batchedUpdates(() => {
          setTeamList(newData);
          setTotalCount(data.totalCount);
          setPage(page + 1)
        // })
        console.log(newData.length, data.totalCount)
        if (newData.length >= data.totalCount) {
          setHasMore(false)
        }
        return
      }
      Toast.show({
        title: intl.formatMessage({id: `${code}`, defaultMessage: message}),
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!options.visible) {
      return
    }
    getData({ current: 1, pageSize: options.initPageSize }, true)
  }, [options.visible, userInfo])

  const handleLoadMore = async () => {
    if (loading || !hasMore) {
      return;
    }
    // const currentPage = page + 1;
    await getData({ current: page, pageSize: 10 }, false);
  }

  return { teamList, teamHasMore: hasMore, teamLoading: loading, teamsCount: totalCount, handleLoadMore };
}

export default useGetTeamData;
