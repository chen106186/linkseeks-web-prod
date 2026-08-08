import { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { message } from '@linkseeks/ui'
import { usePageStatus } from '@/hooks/usePageStatus'
import { GetMemberSupplierInvitationInfoResponse, getMemberSupplierInvitationInfo } from '@apps/apis'
import { FormInstance } from 'antd/lib/form'

/**
 * 邀请码信息获取
 */
const useInviteCode = ({ form }: { form: FormInstance<any> }) => {
  const { invitationCode } = usePageStatus()
  const [inviteCodeInfo, setInviteCodeInfo] = useState<GetMemberSupplierInvitationInfoResponse>()
  const intl = useIntl()

  const getInviteCodeInfo = async () => {
    try {
      const res = await getMemberSupplierInvitationInfo({ invitationCode: invitationCode as string })
      if (res.code === 1000 && res.data) {
        setInviteCodeInfo(res.data)
        if (res.data?.email) {
          form.setFieldValue('email', res.data?.email)
          form.setFieldValue('memberType', res.data?.memberType)
        }
      } else {
        message.destroy()
        message.info(intl.formatMessage({ id: 'register.invitationCode.outdate', defaultMessage: '邀请码已失效' }))
      }
    } catch (error) {}
  }

  useEffect(() => {
    // 如果链接中带有邀请码，则根据邀请码获取信息
    if (invitationCode) {
      getInviteCodeInfo()
    }
  }, [])

  return {
    invitationCode,
    inviteCodeInfo,
  }
}

export default useInviteCode
