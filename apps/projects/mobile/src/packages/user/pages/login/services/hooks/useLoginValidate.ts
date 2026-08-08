import { postMemberMultiAccCheck, PostMemberMultiAccCheckResponse } from '@apps/apis'
import { useRequestApi, useToggle } from '@linkseeks/hooks'
import { useMemo, useState } from 'react'

/**
 * 登录前校验
 */
export const useLoginValidate = () => {
  // 多主体列表选择
  const [data, setData] = useState<PostMemberMultiAccCheckResponse>({} as any)
  const [multiAccountVisible, toggleMultiAccountVisible] = useToggle(false)
  /**
   * 触发校验
   */
  const dispatchLoginValidate = async (values) => {
    const { data, code, message } = await postMemberMultiAccCheck(
      {
        ...values,
      },
      { ctlType: 'none' },
    )

    if (code === 1000) {
      setData(data)
      toggleMultiAccountVisible(data?.length > 1 ? true : false)
    }
    return {
      data,
      code,
      message,
    }
  }

  return {
    multiAccountVisible,
    multiAccInfoRespList: data || [],
    dispatchLoginValidate,
    toggleMultiAccountVisible,
  }
}
