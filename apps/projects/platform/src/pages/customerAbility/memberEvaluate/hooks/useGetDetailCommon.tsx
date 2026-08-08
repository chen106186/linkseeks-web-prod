import { useIntl } from '@linkseeks/i18n'
import React, { useMemo, useState } from 'react'
import { Progress } from 'antd'
import { GetMemberAppraisalResultGetResponse, GetMemberAppraisalSummaryGetResponse } from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import FileListRender from '@/components/UploadFiles/FileListRender'
import { useWebIntl } from '@apps/locales'

/**
 * 获取考评详情页的公共部分
 */
type Options = {
  blackList: string[]
  initialValue?: (GetMemberAppraisalSummaryGetResponse | GetMemberAppraisalResultGetResponse) & {
    name: string
    upperName?: string
    notifyMember: number
    verifySteps?: {
      step: number
      stepName: string
      roleName: string
    }[]
    currentStep: number
  }
}

function useGetDetailCommon(options: Options) {
  const { blackList, initialValue = {} as Options['initialValue'] } = options
  const intl = useIntl()
  const translate = useWebIntl()
  const [anchorHeader] = useState(() => {
    const temp = [
      {
        key: 'progress',
        label: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.circulateProgress' })}`,
      },
      {
        key: 'detail',
        label: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
      },
      {
        key: 'project',
        label: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateProject' })}`,
      },
      {
        key: 'result',
        label: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateResult' })}`,
      },
      {
        key: 'record',
        label: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.circulateRecord' })}`,
      },
    ]
    return temp.filter((item) => !blackList.includes(item.key))
  })

  const basicInfoList = useMemo(() => {
    const isUpperMember = typeof initialValue?.upperName !== 'undefined'
    return [
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumber' })}`,
        value: initialValue?.appraisalNo,
      },
      {
        title: !isUpperMember
          ? translate('web.resource.member.memberName')
          : `${intl.formatMessage({ id: 'supplier.supplierEvaluate.hooks.useGetDetailCommon.uppersupplierName' })}`,
        value: !isUpperMember ? initialValue?.name : initialValue?.upperName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.appendix' })}`,
        value: (
          <div>
            {/* {
            initialValue?.attachments?.map((_row) => {
              return (
                <a key={_row.url} href={_row.url}>{_row.name}</a>
              )
            })
          } */}
            <FileListRender files={initialValue?.attachments} />
          </div>
        ),
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTopic' })}`,
        value: initialValue?.subject,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateArea' })}`,
        span: 2,
        value: (
          <div>
            {`${initialValue?.appraisalDayStart} ${intl.formatMessage({ id: 'common.text.to' })} ${
              initialValue?.appraisalDayEnd
            } `}
          </div>
        ),
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.innerState' })}`,
        value: initialValue?.statusName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateComplateTime' })}`,
        value: initialValue?.completeDay,
      },
    ]
  }, [initialValue])

  const evaluateResultColumn = useMemo(() => {
    return [
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateLastScore' })}`,
        value: initialValue?.totalScore || 0,
        // value: (
        //   <div style={{width: '60px', height: '30px'}}>
        //     <Progress type="dashboard" percent={initialValue?.totalScore || 0} gapDegree={145} width={60} />
        //   </div>
        // )
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateResult' })}`,
        value: initialValue?.result,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.notifyEvaluateResult' })}`,
        value:
          initialValue?.totalScore !== null
            ? initialValue?.notifyMember
              ? `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.yes' })}`
              : `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.no' })}`
            : '',
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.appendix' })}`,
        value: (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {initialValue?.resultAttachments?.map((_row) => {
              return (
                <a style={{ marginBottom: '4px' }} key={_row.url} href={_row.url}>
                  {_row.name}
                </a>
              )
            })}
          </div>
        ),
      },
    ]
  }, [initialValue])

  /**
   * 获取当前工作流
   */
  const auditProcess = useMemo(() => {
    const innerVerifySteps: {
      step: number
      stepName: string
      roleName: string
      status: 'finish' | 'wait'
    }[] =
      initialValue && initialValue.verifySteps
        ? initialValue.verifySteps.map((item) => ({
            step: item.step,
            stepName: item.stepName,
            roleName: item.roleName,
            status: initialValue?.currentStep > item.step ? 'finish' : 'wait',
          }))
        : []

    const innerVerifyCurrent = findLastIndexFlowState(initialValue?.verifySteps)
    const outerVerifyCurrent = 0
    const outerVerifySteps = null
    return {
      innerVerifySteps,
      outerVerifySteps,
      innerVerifyCurrent,
      outerVerifyCurrent,
    }
  }, [initialValue])

  return { anchorHeader, basicInfoList, evaluateResultColumn, auditProcess }
}

export default useGetDetailCommon
