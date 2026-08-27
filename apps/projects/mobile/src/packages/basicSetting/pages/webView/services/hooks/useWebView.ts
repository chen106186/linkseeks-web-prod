import { useEffect, useState } from 'react'
import { showLoading, hideLoading, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import {
  getManageContentNoticeFindAllByColumnType,
  getManageMemberNoticeFindByColumnTypeMemberInfo,
  GetManageContentNoticeFindAllByColumnTypeResponse,
} from '@apps/apis'
import {
  getLocalLegalAgreementByColumnType,
  getLocalLegalAgreementById,
  getLocalLegalAgreementByTitle,
} from '@/constants/legalAgreements'

const useWebView = (id, type, columnType, title?: string, memberInfo?: { memberId: string; roleId: string }) => {
  const [columnTypeList, setColumnTypeList] = useState<GetManageContentNoticeFindAllByColumnTypeResponse[0]>()
  /* 协议 */
  const findAllByColumnType = async () => {
    showLoading()
    const _columnType = columnType ? String(columnType) : type === 'sign' ? '2' : '4'
    const fallbackAgreement =
      getLocalLegalAgreementById(id) ||
      getLocalLegalAgreementByTitle(title) ||
      getLocalLegalAgreementByColumnType(_columnType)
    try {
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
        if (!obj?.content) {
          obj = getLocalLegalAgreementByTitle(obj?.title || title) || fallbackAgreement || obj
        }
        obj?.title && setNavigationBarTitle({ title: obj?.title })
        setColumnTypeList(obj)
        return
      }
      if (fallbackAgreement) {
        fallbackAgreement.title && setNavigationBarTitle({ title: fallbackAgreement.title })
        setColumnTypeList(fallbackAgreement)
      }
    } catch (e) {
      hideLoading()
      if (fallbackAgreement) {
        fallbackAgreement.title && setNavigationBarTitle({ title: fallbackAgreement.title })
        setColumnTypeList(fallbackAgreement)
      }
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
