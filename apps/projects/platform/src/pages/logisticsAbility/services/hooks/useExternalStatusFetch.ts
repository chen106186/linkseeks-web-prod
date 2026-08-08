import { getLogisticsOrderSubmitStatusList, getLogisticsSelectListMemberCompanyQuery } from '@apps/apis'
import { useEffect, useState } from 'react'
export function useExternalStatusFetch() {
  const [statusList, setStatusList] = useState([])
  useEffect(() => {
    const externalStatusFetch = async () => {
      try {
        const res = await getLogisticsOrderSubmitStatusList()
        const list = res.data.map((item: any) => {
          return {
            label: item.message,
            value: item.code,
          }
        })
        setStatusList(list as any)
      } catch (e) {}
    }
    externalStatusFetch()
  }, [])
  return statusList
}

export function useLogisticsSelectListMemberCompanyQueryFetch() {
  const [memberList, setMemberList] = useState([])
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getLogisticsSelectListMemberCompanyQuery()
        const list = res.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          }
        })
        setMemberList(list as any)
      } catch (e) {}
    }
    getData()
  }, [])
  return memberList
}
