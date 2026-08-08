import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useMemo } from 'react'
import { Spin, Card, Table, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../common/hooks/useGetAnchorHeader'
import useGetDetailCommon from '../common/hooks/useGetDetailCommon'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import { getMemberSupplierRectifySummaryGet, GetMemberRectifySummaryGetResponse } from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import FlowRecords from '@/components/FlowRecords'
import { innerColumns, outerColumns } from '../common/columns/historyColumn'

const rectificationAddDetail = () => {
  const { headers, setHeaders } = useGetAnchorHeader()
  const { id } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberRectifySummaryGetResponse, { id: string }>(
    getMemberSupplierRectifySummaryGet,
    params,
  )
  const { basicInfo, editInfo, resultInfo } = useGetDetailCommon({ initialValue: initialValue as any })

  const intl = useIntl()

  const outerVerifySteps = useMemo(() => {
    if (!initialValue?.outerVerifySteps) {
      return []
    }
    return initialValue.outerVerifySteps.map((item) => ({
      step: item.step,
      stepName: item.stepName,
      roleName: item.roleName,
      status: (initialValue?.currentOuterStep >= item.step ? 'finish' : 'wait') as 'finish' | 'wait',
    }))
  }, [initialValue])

  useEffect(() => {
    if (!initialValue) {
      return
    }

    const newHeaders = headers.filter((_item) => {
      if (initialValue?.reportAttachments.length === 0 && _item.key === 'editInfo') {
        return false
      }
      if (initialValue?.agreeResult === null && _item.key === 'result') {
        return false
      }
      return true
    })
    setHeaders(newHeaders)
  }, [initialValue])

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyNo',
        })}: ${initialValue?.rectifyNo}`}
        items={headers}
      >
        <AuditProcess
          outerVerifySteps={outerVerifySteps}
          outerVerifyCurrent={findLastIndexFlowState(initialValue?.outerVerifySteps)}
          id="progress"
        />
        <div id="basicInfo" style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            data={basicInfo}
            title={intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}
            column={3}
          />
        </div>
        {((initialValue?.reportDigest || initialValue?.reportAttachments.length > 0) && (
          <div id="editInfo" style={{ margin: `${theme['@margin-md']} 0` }}>
            <CustomizeColumn
              data={editInfo}
              title={intl.formatMessage({
                id: 'member.memberRectification.common.hooks.useGetAnchorHeader.rectifyMessage',
              })}
              column={1}
            />
          </div>
        )) ||
          null}
        {(initialValue?.agreeResult !== null && (
          <div id="result" style={{ margin: `${theme['@margin-md']} 0` }}>
            <CustomizeColumn
              data={resultInfo}
              title={intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyResult' })}
              column={1}
            />
          </div>
        )) ||
          null}
        <div id="record">
          <FlowRecords
            innerRowkey="id"
            innerColumns={innerColumns as any}
            innerDataSource={initialValue?.innerHistory}
            outerRowkey="id"
            outerColumns={outerColumns as any}
            outerDataSource={initialValue?.outerHistory}
          />
        </div>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default rectificationAddDetail
