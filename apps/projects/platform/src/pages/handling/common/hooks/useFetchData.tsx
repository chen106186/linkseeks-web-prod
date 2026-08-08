import { timeRange } from '@/utils';
import React, { useCallback, useMemo } from 'react';

interface ResponseDataType {
  code: number,
  message: string
}

function useFetchData() {
  const fetchListData = useCallback(async <T, P>(fn: (postData: P, headers: { [key: string]: string }) => Promise<ResponseDataType & { data: T }>, params: P, headers?: { [key: string]: string }) => {
    const { code, data, message } = await fn(params, headers);
    if (code === 1000) {
      return data;
    }
    return {
      totalCount: 0,
      data: [],
    }
  }, [])

  const onFormatSearchData = useCallback(<Q,>(values: Q) => {
    const { docTime, ...rest} = values as Q & { [key: string]: any };
    const {st, et} = timeRange(docTime);
    let searchData = {
      ...rest,
      startTime: st,
      endTime: et
    }
    return searchData
  }, [])

  return { fetchListData, onFormatSearchData }
}

export default useFetchData;
