/**
 * 给Standard table 设置搜索值
 */

import { useCallback, useMemo, useState } from "react";
import { usePageStatus } from "./usePageStatus";

const useSetSearchValueInTable = () => {
  const { id, lastTypeParams, pageStatus, preview, ...rest } = usePageStatus();
  const [searchData, setSearchData] = useState(() => rest);
  const cacheData = useMemo(() => searchData, [searchData])

  const formatInitialValue = useMemo(() => {
    const length = (cacheData && Object.keys(cacheData).length) || 0;
    if (length === 0) {
      return {}
    }
    return {
      value: cacheData
    }
  }, [cacheData])

  const clear = useCallback(() => {
    setSearchData(null);
  }, [])

  return {
    searchData: cacheData,
    formatInitialValue,
    clear
  }
}

export default useSetSearchValueInTable
