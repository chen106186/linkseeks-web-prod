/**
 * 供应商考评 > 待考评打分 > 考评打分详情页
 */
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import React, { useMemo, useRef, useState } from 'react'
import { Spin, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import { recordColumn } from '../columns'
import AuditProcess from '@/components/AuditProcess'
import useGetDetailCommon from '../hooks/useGetDetailCommon'
import theme from '../../../../../config/lingxi.theme.config'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getMemberSupplierAppraisalWaitGradeGet,
  GetMemberAppraisalWaitGradeGetResponse,
  postMemberSupplierAppraisalWaitGradeGrade,
} from '@apps/apis'
import FlowRecords from '@/components/FlowRecords'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import SupplierAssessmentProject from '../createEvaluate/components/SupplierAssessmentProject'
import SupplierAssessmentProjectForm, {
  APSubmitValueType,
  SupplierAssessmentProjectFormRef,
} from '../createEvaluate/components/SupplierAssessmentProjectForm'

const TobeEvaluateDetail: React.FC<any> = () => {
  const { id, lastTypeParams } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const isView = useMemo(() => lastTypeParams === '/preview', [lastTypeParams])
  const { loading, initialValue } = useInitialValue<GetMemberAppraisalWaitGradeGetResponse, { id: string }>(
    getMemberSupplierAppraisalWaitGradeGet,
    params,
  )
  const { anchorHeader, basicInfoList, auditProcess } = useGetDetailCommon({
    blackList: ['result'],
    initialValue: initialValue,
  })

  const [hasScoring, setHasScoring] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const intl = useIntl()

  const assessmentProjectFormRef = useRef<SupplierAssessmentProjectFormRef>()

  const onSubmit = async (value: APSubmitValueType) => {
    try {
      setSubmitLoading(true)
      const { code, data } = await postMemberSupplierAppraisalWaitGradeGrade({
        id: id,
        items: value.items,
      })
      if (code === 1000) {
        setHasScoring(true)
        history.goBack()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({
          id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumber',
        })}: ${initialValue?.appraisalNo}`}
        items={anchorHeader}
        extra={
          !hasScoring &&
          !isView && (
            // <AuthButton type="custom" code="operate">
            <Button type="primary" loading={submitLoading} onClick={() => assessmentProjectFormRef.current.submit()}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.tobeEvaluate.detail.evaluateScore',
              })}
            </Button>
            // </AuthButton>
          )
        }
      >
        <AuditProcess {...auditProcess} id="progress" />
        <div id="detail" style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            data={basicInfoList}
            title={intl.formatMessage({
              id: 'member.memberInspection.common.schema.add.baseInfo',
            })}
            column={3}
          />
        </div>
        {isView ? (
          <SupplierAssessmentProject data={initialValue?.items} />
        ) : (
          <SupplierAssessmentProjectForm
            ref={assessmentProjectFormRef}
            value={initialValue?.items}
            onSubmit={onSubmit}
            rater
          />
        )}
        <div id="record" style={{ margin: `${theme['@margin-md']} 0` }}>
          <FlowRecords innerRowkey="id" innerColumns={recordColumn as any} innerDataSource={initialValue?.history} />
        </div>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default TobeEvaluateDetail
