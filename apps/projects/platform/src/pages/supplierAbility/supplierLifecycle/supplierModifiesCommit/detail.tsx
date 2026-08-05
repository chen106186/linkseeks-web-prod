/**
 * @Description 待提交变更申请单 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getMemberSupplierLifecycleSummaryDetail } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import SupplierModifiesForm, { SubmitCallValueType } from './components/SupplierModifiesForm'
import { useWebIntl } from '@apps/locales'

const SodifySupplierModifies: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitCallValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const translate = useWebIntl()

  const { id } = usePageStatus()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberSupplierLifecycleSummaryDetail({
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
      <SupplierModifiesForm
        title={translate('web.resource.member.biangengshenqingdanxiangqing')}
        value={memberLevelDetails}
        editable={false}
        cloudy
      />
    </Spin>
  )
}

export default SodifySupplierModifies
