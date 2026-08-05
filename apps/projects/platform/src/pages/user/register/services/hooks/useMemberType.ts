import { useState, useEffect } from 'react'
import type {
  GetMemberMemberRoleConfigGetMemberTypeListResponse,
  GetMemberMemberRoleConfigGetMemberRoleListByMemberTypeResponse,
} from '@apps/apis'
import {
  getMemberMemberRoleConfigGetMemberRoleListByMemberType,
  getMemberPlatformRoleRuleRegisterSubMemberRole,
} from '@apps/apis'
import { FormInstance } from 'antd/lib/form'
import { usePageStatus } from '@/hooks/usePageStatus'
import { decodeURLBase64 } from '@linkseeks/crypto'
import { getUrlMemberId } from '@/utils'

interface IProps {
  form: FormInstance<any>
  show: boolean
  onNextAction?: Function
}

const useMemberType = ({ form, show, onNextAction }: IProps) => {
  const { source, redirect } = usePageStatus()
  const [memberType, setMemberType] = useState<GetMemberMemberRoleConfigGetMemberTypeListResponse>([])
  const [memberRoleList, setMemberRoleList] = useState<GetMemberMemberRoleConfigGetMemberRoleListByMemberTypeResponse>(
    [],
  )

  const getMemberRoleByType = async () => {
    const res = await getMemberMemberRoleConfigGetMemberRoleListByMemberType({
      memberType: null,
    })
    if (res.code === 1000 && res.data) {
      setMemberRoleList(res.data)
      if (res.data.length === 1) {
        form.setFieldValue('memberRoleId', res.data[0].roleId)
        onNextAction && onNextAction()
      }
    }
  }

  const getSassRoleByMemberId = async (memberId: string) => {
    const res = await getMemberPlatformRoleRuleRegisterSubMemberRole({ memberId })
    if (res.code === 1000 && Array.isArray(res.data) && res.data.length > 0) {
      setMemberType(
        res.data.map((item) => {
          return {
            configEnum: item.memberType,
            configEnumName: item.memberTypeName,
          }
        }),
      )

      if (res.data.length === 1) {
        const dataItem = res.data[0]
        form.setFieldValue('memberType', dataItem.memberType)
        getMemberRoleByType()
      }
    }
  }

  useEffect(() => {
    if (show) {
      getMemberRoleByType()

      if (redirect) {
        const redirectUrl = decodeURIComponent(decodeURLBase64(redirect))
        // 判断来源是自营商城时从链接获取自营商城的memberId
        if (source && source === 'own') {
          const memberId = getUrlMemberId(redirectUrl)
          getSassRoleByMemberId(String(memberId))
          return
        }
      }
    }
  }, [show])

  return {
    memberType,
    memberRoleList,
  }
}

export default useMemberType
