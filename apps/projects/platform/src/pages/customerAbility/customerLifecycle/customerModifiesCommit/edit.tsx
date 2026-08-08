/**
 * @Description 待提交变更申请单 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { getMemberCustomerLifecycleSummaryDetail, postMemberCustomerLifecycleWaitAddUpdate } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import CustomerModifiesForm, { SubmitCallValueType } from './components/CustomerModifiesForm'

const ModifyCustomerModifies: React.FC<{}> = (props) => {
  const [modifiesDetails, setModifiesDetails] = useState<SubmitCallValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberCustomerLifecycleSummaryDetail({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setModifiesDetails({
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

  const handleRoleRuleConfigFormSubmit = (value: SubmitCallValueType): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: '正在修改，请稍候...',
        duration: 0,
      })
      postMemberCustomerLifecycleWaitAddUpdate({
        id: +id,
        ...value,
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
      <CustomerModifiesForm
        title="编辑变更申请单"
        value={modifiesDetails}
        onSubmit={handleRoleRuleConfigFormSubmit}
        cloudy
      />
    </Spin>
  )
}

export default ModifyCustomerModifies
