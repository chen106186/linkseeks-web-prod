import type { GetManageContentNoticeFindAllByColumnTypeResponse } from '@apps/apis'
import { getManageContentNoticeFindAllByColumnType } from '@apps/apis'
import { useEffect, useState } from 'react'

/**
 * 获取注册协议
 */
const useAgreement = () => {
  const [agreementList, setAgreementList] = useState<GetManageContentNoticeFindAllByColumnTypeResponse>([])

  const fetchAgreement = () => {
    const param: any = {
      columnType: 2,
    }

    getManageContentNoticeFindAllByColumnType(param).then((res) => {
      if (res.code === 1000) {
        setAgreementList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchAgreement()
  }, [])

  return {
    agreementList,
  }
}

export default useAgreement
