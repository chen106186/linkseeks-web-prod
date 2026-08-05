import { useMemo } from 'react'
import { getManageContentNoticeFindAllByColumnType, getManageMemberNoticeFindAllByColumnType } from '@apps/apis'
import { useRequestApi, useToggle } from '@linkseeks/hooks'

export enum NoticeColumnType {
  // 会员首页公告
  MEMBER_HOME = 1,
  // 注册须知
  REGISTER = 2,
  // 入库须知
  LIBRARY_AGREEMENT = 3,
  // 会员服务协议
  MEMBER_SERVICE = 4,
  // 商城账号注销
  LOGOFF = 5,
}

/**
 * 获取公告协议内容
 */
const useNotice = (columnType: NoticeColumnType) => {
  const { data } = useRequestApi(getManageContentNoticeFindAllByColumnType, { defaultParams: [{ columnType } as any] })

  const noticeContent = useMemo(() => {
    if (data && data.length > 0) {
      return data[0].content
    } else {
      return ''
    }
  }, [data])
  return {
    noticeContent,
    notice: data,
  }
}

export default useNotice
