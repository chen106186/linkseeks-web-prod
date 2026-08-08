import { useEffect, useState } from 'react';
import { Toast } from '@apps/mobile-ui';
import useStores from '@/store/useStores';
import { useIntl } from '@linkseeks/i18n';

const useFetchCollection = (api: Function, mode: string, active: string, header?: any) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const {
    userStore: { shopAndSite },
  } = useStores();
  const intl = useIntl()
  const fetchData = async (postData: any) => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      const { data, message, code } = await api(postData, { headers: header ?? {} })
      if (code !== 1000) {
        Toast.show({icon:'none',title: intl.formatMessage({id: `${code}`, defaultMessage: message})});
        return;
      }
      const newData = dataSource.concat(data.data);
      setDataSource(newData)
      // page * 10 > data,totalCount 是为了解决脏数据
      if (newData.length >= data.totalCount || page * 10 > data.totalCount) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active === mode && page === 1 && hasMore) {
      const arr = [1, 2]
      if (arr.includes(Number(shopAndSite?.property))) {
        fetchData({ current: page, pageSize: 10 })
      }
    }
  }, [active])

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return;
    }
    setPage(page + 1)
    fetchData({ current: page + 1, pageSize: 10 });
  }

  return { loading, hasMore, dataSource, fetchData, handleLoadMore };
}

export default useFetchCollection;
