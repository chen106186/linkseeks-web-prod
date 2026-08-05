import React, { useMemo } from 'react'
import { Spin, Card, Table, Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import { projectColumns, recordColumn } from '../columns'
import useGetDetailCommon from '../hooks/useGetDetailCommon'
import useModal from '../hooks/useModal'
import theme from '../../../../../config/lingxi.theme.config'
import ExamVerify, { SubmitDataTypes } from '@/components/ExamVerify'
import { findLastIndexFlowState } from '@/utils'
import FlowRecords from '@/components/FlowRecords'
import useInitialValue from '@/hooks/useInitialValue'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberSupplierAppraisalWaitAuditOneGet,
  GetMemberAppraisalWaitAuditOneGetResponse,
  postMemberSupplierAppraisalWaitAuditOneAudit,
} from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import SupplierAssessmentProject from '../createEvaluate/components/SupplierAssessmentProject'

const TobeEvaluateDetail = () => {
  const { id, lastTypeParams } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberAppraisalWaitAuditOneGetResponse, { id: string }>(
    getMemberSupplierAppraisalWaitAuditOneGet,
    params,
  )
  const { anchorHeader, basicInfoList, evaluateResultColumn, auditProcess } = useGetDetailCommon({
    blackList: ['result'],
    initialValue: initialValue,
  })

  const isView = useMemo(() => lastTypeParams === '/preview', [lastTypeParams])

  const { visible, toggle } = useModal()
  const intl = useIntl()

  const onSubmit = async (values: SubmitDataTypes) => {
    const { data, code } = await postMemberSupplierAppraisalWaitAuditOneAudit({
      id: +id,
      agree: values.status,
      reason: values.reason,
    })
    if (code === 1000) {
      history.goBack()
    }
  }

  const onCancel = () => {
    toggle(false)
  }

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({
          id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumber',
        })}: ${initialValue?.appraisalNo}`}
        items={anchorHeader}
        extra={
          !isView && (
            // <AuthButton type="custom" code="audit">
            <Button type="primary" onClick={() => toggle(true)} icon={<CheckCircleOutlined />}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.tobeReviewI.detail.audit',
              })}
            </Button>
            // </AuthButton>
          )
        }
      >
        <AuditProcess {...auditProcess} id="progress" />
        <div style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            id="detail"
            data={basicInfoList}
            title={intl.formatMessage({
              id: 'member.memberInspection.common.schema.add.baseInfo',
            })}
            column={3}
          />
        </div>
        <SupplierAssessmentProject data={initialValue?.items} />
        <div style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            id="result"
            data={evaluateResultColumn}
            title={intl.formatMessage({
              id: 'member.memberEvaluate.allQuery.detail.evaluateResult',
            })}
          />
        </div>
        <div id="record">
          <FlowRecords innerRowkey="id" innerColumns={recordColumn as any} innerDataSource={initialValue?.history} />
        </div>
      </PageHeaderWrapper>
      <ExamVerify
        visible={visible}
        title={intl.formatMessage({
          id: 'member.memberEvaluate.tobeReviewI.detail.audit',
        })}
        onSubmit={onSubmit}
        onCancel={onCancel}
        showLabel={false}
      />
    </Spin>
  )
}

export default TobeEvaluateDetail
