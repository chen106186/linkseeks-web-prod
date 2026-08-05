import { useIntl } from '@linkseeks/i18n'
import React, { useMemo } from 'react'
import { Spin, Card, Steps, Table, Progress, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import theme from '../../../../../config/lingxi.theme.config'
import { projectColumns, recordColumn } from '../columns'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import useGetDetailCommon from '../hooks/useGetDetailCommon'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import { getMemberSupplierAppraisalSummaryGet, GetMemberAppraisalSummaryGetResponse } from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import FlowRecords from '@/components/FlowRecords'
import SupplierAssessmentProject from '../createEvaluate/components/SupplierAssessmentProject'

const { Step } = Steps

const EvaluateDetail = () => {
  const { id } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberAppraisalSummaryGetResponse, { id: string }>(
    getMemberSupplierAppraisalSummaryGet,
    params,
  )
  const { anchorHeader, basicInfoList, evaluateResultColumn, auditProcess } = useGetDetailCommon({
    blackList: ['result'],
    initialValue: initialValue,
  })
  const intl = useIntl()
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumber' })}: ${
          initialValue?.appraisalNo
        }`}
        items={anchorHeader}
        // extra={headExtra && headExtra(detailInfo, returnAddress, exchangeAddress)}
      >
        <AuditProcess {...auditProcess} id="progress" />
        <div style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            id="detail"
            data={basicInfoList}
            title={intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}
            column={3}
          />
        </div>
        <SupplierAssessmentProject data={initialValue?.items} />
        <div style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            id="result"
            data={evaluateResultColumn}
            title={intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateResult' })}
          />
        </div>
        <div id="record">
          <FlowRecords innerRowkey="id" innerColumns={recordColumn as any} innerDataSource={initialValue?.history} />
        </div>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default EvaluateDetail
