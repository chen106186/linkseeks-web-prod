import { getSupportCustomerServiceConfigGetConfigByType } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'
/**
 * 获取客服信息
 */
export const useCustomerService = () => {
  const { data, loading: customerLoading } = useRequestApi(getSupportCustomerServiceConfigGetConfigByType, {
    defaultParams: [{ serviceType: '2' }],
  })

  const customerInfo = useMemo(() => {
    if (data) {
      return data
    } else {
      return null
    }
  }, [data])
  /**
   * 1 - 七鱼客服
   * 2 - IM客服
   * 0 - 没有配置客服信息
   */
  const customerType = useMemo(() => {
    if (customerInfo) {
      return customerInfo.serviceType
    } else {
      return 0
    }
  }, [customerInfo])

  /**
   * 获取跳转到客服界面
   */
  const getToCustomerUrl = async (auth, userId) => {
    if (!auth) {
      return false
    }
    switch (customerType) {
      case 1: {
        // 七鱼客服 todo

        return
      }

      case 2: {
        //   // 腾讯客服
        const userID = `TIM-${userId}`
        const conversationID = `C2C${userID}`
        return {
          url: 'im/chatRoom',
          payload: {
            conversationID,
          },
        }
      }

      default: {
        // 无效跳转
        return
      }
    }
  }
  return {
    getToCustomerUrl,
    customerType,
    customerInfo,
    customerLoading,
  }
}
