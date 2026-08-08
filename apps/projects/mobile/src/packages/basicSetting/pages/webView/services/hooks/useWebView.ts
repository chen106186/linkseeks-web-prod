import { useEffect, useState } from 'react'
import { showLoading, hideLoading, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import {
  getManageContentNoticeFindAllByColumnType,
  getManageMemberNoticeFindByColumnTypeMemberInfo,
  GetManageContentNoticeFindAllByColumnTypeResponse,
} from '@apps/apis'

const useWebView = (id, type, columnType, memberInfo?: { memberId: string; roleId: string }) => {
  const [columnTypeList, setColumnTypeList] = useState<GetManageContentNoticeFindAllByColumnTypeResponse[0]>()
  /* 协议 */
  const findAllByColumnType = async () => {
    showLoading()
    const _columnType = columnType ? String(columnType) : type === 'sign' ? '2' : '4'
    const res = memberInfo
      ? await getManageMemberNoticeFindByColumnTypeMemberInfo({
          columnType: _columnType,
          memberId: memberInfo?.memberId,
          roleId: memberInfo?.roleId,
        })
      : await getManageContentNoticeFindAllByColumnType({ columnType: _columnType })
    hideLoading()
    if (res.code === 1000) {
      let obj: any = {}
      if (type === 'sign') {
        res.data.map((item: any) => {
          if (item.id == id) {
            obj = item
          }
        })
      } else {
        obj = res.data?.[0]
      }
      obj?.title && setNavigationBarTitle({ title: obj?.title })
      setColumnTypeList(obj)
    }
  }
  useEffect(() => {
    findAllByColumnType()
  }, [])

  return {
    columnTypeList,
  }
}

export default useWebView
