/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-18 11:11:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:22:32
 * @Description:
 */
import React, { useCallback, useMemo, useState } from 'react'
import { Spin, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../../complaintsAndSuggests/common/hooks/useGetAnchorHeader'
import useGetDetailCommon from './common/hooks/useGetDetailCommon'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getMemberSupplierComplaintSubGet,
  GetMemberComplaintSubGetRequest,
  GetMemberComplaintSubGetResponse,
  postMemberSupplierComplaintSubSubmit,
} from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'

const TobeEvaluateDetail = () => {
  const { id, lastTypeParams } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { initialValue } = useInitialValue<GetMemberComplaintSubGetResponse, GetMemberComplaintSubGetRequest>(
    getMemberSupplierComplaintSubGet,
    params,
  )
  const { headers } = useGetAnchorHeader([], { initialValue: initialValue })
  const { basicInfo, resultInfo } = useGetDetailCommon({ initialValue })
  const isDetail = useMemo(() => lastTypeParams === '/detail', [lastTypeParams])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const intl = useIntl()

  const handleSubmit = async () => {
    setSubmitLoading(true)
    const service = postMemberSupplierComplaintSubSubmit
    const { data, code } = await service({ id: +id })
    setSubmitLoading(false)
    if (code === 1000) {
      history.goBack()
    }
  }

  return (
    <Spin spinning={false}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTopic' })}：${
          initialValue?.subject
        }`}
        items={headers}
        extra={
          isDetail && (
            <Button type="primary" loading={submitLoading} icon={<FormOutlined />} onClick={handleSubmit}>
              {intl.formatMessage({ id: 'member.complaintsAndSuggests.index.submitComplaintSuggest' })}
            </Button>
          )
        }
      >
        <CustomizeColumn
          id="detail"
          data={basicInfo}
          title={intl.formatMessage({ id: 'member.complaintsAndSuggests.detail.complaintSuggest' })}
          column={3}
        />
        {initialValue?.handleResult && (
          <div style={{ margin: `${theme['@margin-md']} 0` }}>
            <CustomizeColumn
              id="result"
              data={resultInfo}
              title={intl.formatMessage({ id: 'member.complaintsAndSuggests.detail.dealResultInfo' })}
              column={3}
            />
          </div>
        )}
      </PageHeaderWrapper>
    </Spin>
  )
}

export default TobeEvaluateDetail
