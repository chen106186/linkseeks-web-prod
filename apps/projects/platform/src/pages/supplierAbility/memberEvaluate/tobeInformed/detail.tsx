import React, { useMemo, useState } from 'react'
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
import { usePageStatus } from '@/hooks/usePageStatus'
import { findLastIndexFlowState } from '@/utils'
import FlowRecords from '@/components/FlowRecords'
import {
  getMemberSupplierAppraisalSummaryGet,
  GetMemberAppraisalSummaryGetResponse,
  postMemberSupplierAppraisalWaitNotificationNotification,
} from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import useInitialValue from '@/hooks/useInitialValue'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import SupplierAssessmentProject from '../createEvaluate/components/SupplierAssessmentProject'

const TobeEvaluateDetail = () => {
  const { id, lastTypeParams } = usePageStatus()

  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberAppraisalSummaryGetResponse, { id: string }>(
    getMemberSupplierAppraisalSummaryGet,
    params,
  )
  const { anchorHeader, basicInfoList, evaluateResultColumn, auditProcess } = useGetDetailCommon({
    blackList: [],
    initialValue: initialValue,
  })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const isView = useMemo(() => lastTypeParams === '/preview', [lastTypeParams])
  const intl = useIntl()

  const onSubmitRes = async () => {
    try {
      setSubmitLoading(true)
      const { code, data } = await postMemberSupplierAppraisalWaitNotificationNotification({ idList: [+id] })
      if (code === 1000) {
        history.goBack()
      }
    } catch (error) {
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
          !isView && (
            // <AuthButton type="custom" code="notify">
            <Button loading={submitLoading} type="primary" onClick={onSubmitRes} icon={<CheckCircleOutlined />}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.tobeInformed.detail.notifyEvaluateResult',
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
    </Spin>
  )
}

export default TobeEvaluateDetail
