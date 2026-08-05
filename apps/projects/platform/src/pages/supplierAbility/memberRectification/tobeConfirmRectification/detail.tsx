import React, { useMemo, useState } from 'react'
import { Spin, Card, Table, Button, Drawer } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../common/hooks/useGetAnchorHeader'
import useGetDetailCommon from '../common/hooks/useGetDetailCommon'
import useModal from '../../memberEvaluate/hooks/useModal'
import SchemaForm, { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import confirmEditResultSchema from './schema'
import {
  GetMemberRectifyWaitAddGetResponse,
  getMemberSupplierRectifyWaitConfirmGet,
  postMemberSupplierRectifyWaitConfirmConfirm,
} from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import FlowRecords from '@/components/FlowRecords'
import { innerColumns, outerColumns } from '../common/columns/historyColumn'
import { findLastIndexFlowState } from '@/utils'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const formActions = createFormActions()

const TobeEvaluateDetail = () => {
  const { visible, toggle } = useModal()
  const { headers } = useGetAnchorHeader(['editInfo', 'result'])
  const { id, lastTypeParams } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberRectifyWaitAddGetResponse, { id: string }>(
    getMemberSupplierRectifyWaitConfirmGet,
    params,
  )
  const { basicInfo, editInfo, resultInfo } = useGetDetailCommon({ initialValue })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const isView = useMemo(() => lastTypeParams === '/preview', [lastTypeParams])
  const intl = useIntl()

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

  const onSubmitRes = () => {
    formActions.submit()
  }

  const handleSubmit = async (value: { result: 0 | 1; reason: string }) => {
    try {
      setSubmitLoading(true)
      const { data, code } = await postMemberSupplierRectifyWaitConfirmConfirm({
        id: +id,
        agree: value.result,
        reason: value.reason,
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

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={initialValue?.subject}
        items={headers}
        extra={
          (!isView && (
            // <AuthButton type="custom" code="submit">
            <Button type="primary" onClick={() => toggle(true)}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.components.FormilySelectMember.index.submit',
              })}
            </Button>
            // </AuthButton>
          )) ||
          null
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
            title={intl.formatMessage({
              id: 'member.memberInspection.common.schema.add.baseInfo',
            })}
            column={3}
          />
        </div>
        <div id="editInfo" style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            data={editInfo}
            title={intl.formatMessage({
              id: 'member.memberRectification.common.hooks.useGetAnchorHeader.rectifyMessage',
            })}
            column={1}
          />
        </div>
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
      <Drawer
        visible={visible}
        onClose={() => toggle(false)}
        width={440}
        title={intl.formatMessage({
          id: 'member.memberRectification.tobeConfirmRectification.detail.confirmRectifyResult',
        })}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => toggle(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel',
              })}
            </Button>
            <Button loading={submitLoading} onClick={onSubmitRes} type="primary">
              {intl.formatMessage({
                id: 'member.memberEvaluate.components.FormilySelectMember.index.submit',
              })}
            </Button>
          </div>
        }
      >
        <NiceForm schema={confirmEditResultSchema} actions={formActions} onSubmit={handleSubmit} />
      </Drawer>
    </Spin>
  )
}

export default TobeEvaluateDetail
