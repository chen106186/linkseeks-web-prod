/** 考评结果查询 > 考评结果详情 */
import { useIntl } from '@linkseeks/i18n'
import React, { useMemo } from 'react'
import { Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import theme from '../../../../../config/lingxi.theme.config'
import CustomizeColumn from '@/components/CustomizeColumn'
import useGetDetailCommon from '../hooks/useGetDetailCommon'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import { getMemberCustomerAppraisalResultGet, GetMemberCustomerAppraisalResultGetResponse } from '@apps/apis'
import SupplierAssessmentProject from '../../memberEvaluate/createEvaluate/components/SupplierAssessmentProject'

const EvaluateDetail = () => {
  const { id } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberCustomerAppraisalResultGetResponse, { id: string }>(
    getMemberCustomerAppraisalResultGet,
    params,
  )
  const { anchorHeader, basicInfoList, evaluateResultColumn } = useGetDetailCommon({
    blackList: ['progress', 'record'],
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
      >
        <div style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            id="detail"
            data={basicInfoList}
            title={intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}
            column={3}
          />
        </div>
        <SupplierAssessmentProject data={initialValue?.items} />
        <div style={{ margin: `${theme['@margin-md']} 0` }} id="result">
          <CustomizeColumn
            data={evaluateResultColumn}
            title={intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateResult' })}
          />
        </div>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default EvaluateDetail
