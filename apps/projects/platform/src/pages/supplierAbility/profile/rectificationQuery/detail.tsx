import React, { useEffect, useMemo, useState } from 'react'
import { Spin, Card, Table, Button, Drawer } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../../memberRectification/common/hooks/useGetAnchorHeader'
import useGetDetailCommon from '../../memberRectification/common/hooks/useGetDetailCommon'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getMemberSupplierRectifyManageGet,
  GetMemberRectifyManageGetResponse,
  GetMemberRectifyWaitAddGetResponse,
  postMemberSupplierRectifyManageUpdateReport,
} from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import FlowRecords from '@/components/FlowRecords'
import { innerColumns, outerColumns } from '../../memberRectification/common/columns/historyColumn'
import useModal from '../../memberEvaluate/hooks/useModal'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { rectificationReportSchema } from './schema'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import { FormOutlined } from '@ant-design/icons'

const formActions = createFormActions()

const rectificationAddDetail = () => {
  const { visible, toggle } = useModal()
  const { headers, setHeaders } = useGetAnchorHeader()
  const { id, lastTypeParams } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberRectifyManageGetResponse, { id: string }>(
    getMemberSupplierRectifyManageGet,
    params,
  )
  const { basicInfo, editInfo, resultInfo } = useGetDetailCommon({
    initialValue: initialValue as GetMemberRectifyManageGetResponse as any,
  })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const intl = useIntl()

  const isDetail = useMemo(() => lastTypeParams === '/detail', [lastTypeParams])

  const outerVerifySteps = useMemo(() => {
    if (!initialValue?.outerVerifySteps) {
      return []
    }
    return initialValue.outerVerifySteps.map((item) => ({
      step: item.step,
      stepName: item.stepName,
      roleName: item.roleName,
      status: (initialValue?.currentOuterStep > item.step ? 'finish' : 'wait') as 'finish' | 'wait',
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

  const onSubmitRes = () => {
    formActions.submit()
  }

  const handleSubmit = async (value: { reportDigest: string; reportAttachments: { name: string; url: string }[] }) => {
    try {
      setSubmitLoading(true)
      const { data, code } = await postMemberSupplierRectifyManageUpdateReport({
        id: +id,
        reportDigest: value.reportDigest,
        reportAttachments: value.reportAttachments.map((_row) => ({
          name: _row.name,
          url: _row.url,
        })),
      })
      if (code === 1000) {
        toggle(false)
        history.goBack()
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false)
    }
  }

  const formValue = {
    reportDigest: initialValue?.reportDigest,
    reportAttachments: initialValue?.reportAttachments || [],
  }

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyNo',
        })}: ${initialValue?.rectifyNo}`}
        items={headers}
        extra={
          initialValue?.currentOuterStep === 2 &&
          !isDetail && (
            <Button type="primary" icon={<FormOutlined />} onClick={() => toggle(true)}>
              {intl.formatMessage({ id: 'member.memberQuery.rectificationQuery.detail.fillRectifyInfo' })}
            </Button>
          )
        }
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
            outerRowkey="id"
            outerColumns={outerColumns as any}
            outerDataSource={initialValue?.outerHistory}
          />
        </div>
        <Drawer
          visible={visible}
          onClose={() => toggle(false)}
          width={540}
          title={intl.formatMessage({ id: 'member.memberQuery.rectificationQuery.detail.rectifyReport' })}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => toggle(false)} style={{ marginRight: 8 }}>
                {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel' })}
              </Button>
              <Button loading={submitLoading} onClick={onSubmitRes} type="primary">
                {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.submit' })}
              </Button>
            </div>
          }
        >
          <NiceForm
            schema={rectificationReportSchema}
            actions={formActions}
            onSubmit={handleSubmit}
            components={{ FormilyUploadFiles }}
            value={formValue}
          />
        </Drawer>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default rectificationAddDetail
