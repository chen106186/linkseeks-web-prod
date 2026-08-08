/**
 * @Description 查询是否给下级设置了会员体系
 */
import { useEffect, useState } from 'react'
import {
  getMemberSupplierAbilityLevelIsConfiguration,
  getMemberCustomerAbilityLevelIsConfiguration,
  getMemberAbilityLevelIsConfiguration,
} from '@apps/apis'

type MemberType = 'member' | 'supplier' | 'customer'

const API_MAP = {
  member: getMemberAbilityLevelIsConfiguration,
  supplier: getMemberSupplierAbilityLevelIsConfiguration,
  customer: getMemberCustomerAbilityLevelIsConfiguration,
}

const useCheckConfigMember = (validateId: number, type: MemberType): {
  isConfigMember: boolean,
  isConfigMemberLoading: boolean,
} => {
  const [isConfigMember, setIsConfigMember] = useState<boolean>(false)
  const [isConfigMemberLoading, setIsConfigMemberLoading] = useState<boolean>(false)

  /**
   * 查询是否设置了会员体系
   */
  const checkConfigMember = async (): Promise<boolean> => {
    try {
      setIsConfigMemberLoading(true)
      const res = await API_MAP[type]({ validateId: `${validateId}` })
      if (res.code === 1000) {
        setIsConfigMember(res.data)
        return res.data
      }
      setIsConfigMember(false)
      return false
    } catch (error) {
      setIsConfigMember(false)
      return false
    } finally {
      setIsConfigMemberLoading(false)
    }
  }

  useEffect(() => {
    if (validateId) {
      checkConfigMember()
    }
  }, [])

  return {
    isConfigMember,
    isConfigMemberLoading,
  }
}

export default useCheckConfigMember
