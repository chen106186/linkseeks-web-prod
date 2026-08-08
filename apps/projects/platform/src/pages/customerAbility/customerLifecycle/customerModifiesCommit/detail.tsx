/**
 * @Description 待提交变更申请单 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getMemberCustomerLifecycleSummaryDetail } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import CustomerModifiesForm, { SubmitCallValueType } from './components/CustomerModifiesForm'

const SodifyCustomerModifies: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitCallValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberCustomerLifecycleSummaryDetail({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setMemberLevelDetails({
            subMemberId: res.data.subMemberId,
            subRoleId: res.data.subRoleId,
            subMemberName: res.data.subMemberName,
            currentLifecycleStageId: res.data.currentLifecycleStageId,
            currentLifecycleStageName: res.data.currentLifecycleStage,
            targetLifecycleStageId: res.data.targetLifecycleStageId,
            changeRequestSummary: res.data.changeRequestSummary,
            remark: res.data.remark,
            items: res.data.items,
            submitVO: {
              totalScore: res.data.totalScore,
              scoringResult: res.data.scoringResult,
              scoringResultContent: res.data.scoringResultContent,
              notifyMember: res.data.notifyMember,
              resultAttachments: res.data.resultAttachments,
            },
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

  return (
    <Spin spinning={detailsLoading}>
      <CustomerModifiesForm title="变更申请单详情" value={memberLevelDetails} editable={false} cloudy />
    </Spin>
  )
}

export default SodifyCustomerModifies
