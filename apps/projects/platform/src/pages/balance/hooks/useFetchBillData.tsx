/**
 * 结算单据，应收账款结算， 应付账款结算的物流单，订单，生产通知单hook
 */

import { usePageStatus } from "@/hooks/usePageStatus";
import { useEffect, useRef, useState } from "react";

function useFetchBillData(getDetailApi) {
  const ref = useRef<any>({});
  const [infoDetail, setInfoDetail] = useState<any>(null);
  const { id } = usePageStatus();

  const fetchListData = async (api, params) => {
    const { data } = await api(params)
    return data
  }

  useEffect(() => {
    if(id) {
      // 获取详情
      async function fetchDetail() {
        const { data } = await getDetailApi({id})
        setInfoDetail(data);
      }
      fetchDetail();
    }
  }, [id])

   /**
   * 搜索
   */
  const handleSearch = (values) => {
    const format = 'YYYY-MM-DD'
    const startTime = values.startTime?.format(format);
    const endTime = values.endTime ? values.endTime.endOf("day").format('YYYY-MM-DD HH:mm:ss') : "";
    const payStartTime = values.payStartTime?.format(format);
    const payEndTime = values.payEndTime ? values.payEndTime.endOf("day").format('YYYY-MM-DD HH:mm:ss') : "";
    ref.current.reload({...values, startTime, endTime, payStartTime, payEndTime});
  }

  return { ref, handleSearch, fetchListData, infoDetail }

}

export default useFetchBillData
