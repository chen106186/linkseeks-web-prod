/**
 * @Description 会员拜访 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { getMemberCustomerVisitDetails, postMemberCustomerVisitAddOrUpdate } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { normalizeFiledata } from '@/utils'
import MemberVisitForm, { SubmitValue, SubmitValueType } from './components/MemberVisitForm'

const ModifyMemberVisit: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()
  const intl = useIntl()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberCustomerVisitDetails({
      id: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { memberId, visitorId, visitor, visitDate, visitAttachments, ...rest } = res.data
          setMemberLevelDetails({
            ...rest,
            subMember: [{ memberId: memberId, name: rest.memberName }] as any[],
            visitorMember: [{ userId: visitorId, name: visitor }] as any[],
            visitDate: formatTimeString(visitDate, 'YYYY-MM-DD'),
            files: visitAttachments ? visitAttachments.map((item) => normalizeFiledata(item.url)) : [],
          })
        }
      })
      .finally(() => {
        setDetailsLoading(false)
      })
  }

  useEffect(() => {
    fetchMemberLevelDetails()
  }, [])

  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: intl.formatMessage({
          id: 'member.memberVisitManage.modify.modifying',
          defaultMessage: '正在修改，请稍候...',
        }),
        duration: 0,
      })
      const { subMember, visitorMember, visitDate, files, ...rest } = value
      postMemberCustomerVisitAddOrUpdate({
        id: +id,
        ...rest,
        memberId: subMember[0].memberId,
        visitorId: visitorMember[0].userId,
        visitDate: moment(visitDate).valueOf(),
        visitAttachments: files
          ? files.map((item) => ({
              name: item.name,
              url: item.url,
            }))
          : [],
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            setTimeout(() => {
              history.goBack()
            }, 800)
          } else {
            reject()
          }
        })
        .finally(() => {
          msg()
        })
    })

  return (
    <Spin spinning={detailsLoading}>
      <MemberVisitForm
        title={intl.formatMessage({ id: 'customerAbility.visitManage.modify.title', defaultMessage: '编辑客户拜访' })}
        value={memberLevelDetails}
        onSubmit={handleRoleRuleConfigFormSubmit}
        cloudy
      />
    </Spin>
  )
}

export default ModifyMemberVisit
