import { getEnhanceSupplierAllOuterAndInner } from '@apps/apis';
import React, { useCallback, useState } from 'react';

export type FilterResType = {
  innerStatus: {label: string, value: number}[],
  outerStatus: {label: string, value: number}[],
}

/**
 * 获取列表页，搜索条件
 * 暂时写死
 */
function useFetchFilterData(): { filterRes: FilterResType,  fetchSelectOptions: () => Promise<FilterResType>} {
  const [filterRes, setFilterRes] = useState<FilterResType>({
    innerStatus: [],
    outerStatus: [],
  })
  const fetchSelectOptions = useCallback(async () => {
    const { data, code } = await getEnhanceSupplierAllOuterAndInner()
    if(code === 1000) {
      const res = {
        innerStatus: data.innerList.map((item: any) => ({label: item.message, value: item.code})),
        outerStatus: data.outerList.map((item: any) => ({label: item.message, value: item.code})),
      }
      setFilterRes(res);
      return res;
    }
    return {
      innerStatus: [],
      outerStatus: [],
    }
  }, []);
  return { fetchSelectOptions, filterRes}
}

export default useFetchFilterData;
