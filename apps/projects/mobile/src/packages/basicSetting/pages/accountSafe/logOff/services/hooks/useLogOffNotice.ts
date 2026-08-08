import { useState, useEffect } from 'react'
import {
  getManageContentNoticeFindAllByColumnType,
  GetManageContentNoticeFindAllByColumnTypeResponse,
  getMemberMobileSecurityCancellationGetEnumType,
} from '@apps/apis'
const useLogOffNotice = () => {
  const [columnTypeList, setColumnTypeList] = useState<GetManageContentNoticeFindAllByColumnTypeResponse[]>([])
  /* 协议 */
  const findAllByColumnType = () => {
    getMemberMobileSecurityCancellationGetEnumType().then((res) => {
      if (res.code === 1000) {
        getManageContentNoticeFindAllByColumnType({ columnType: res.data }).then((resNotice: any) => {
          if (resNotice.code === 1000) {
            setColumnTypeList(resNotice.data)
          }
        })
      }
    })
  }
  useEffect(() => {
    findAllByColumnType()
  }, [])

  return {
    columnTypeList,
  }
}

export default useLogOffNotice
