/*
 * @Description: 确认变更申请单
 */
import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberCustomerLifecycleSummaryDetail, postMemberCustomerLifecycleWaitConfirmConfirm } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import CustomerModifiesProfile from '../components/CustomerModifiesProfile'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'

const CustomerModifiesConfirmVerify: React.FC<any> = (props) => {
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { id } = usePageStatus()

  const intl = useIntl()

  const { data: details, loading: infoLoading } = useHttpRequest(
    () => getMemberCustomerLifecycleSummaryDetail({ id }),
    { manual: false },
  )

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postMemberCustomerLifecycleWaitConfirmConfirm(
      {
        id: +id,
        ...value,
      },
      {
        timeout: 0,
      },
    )
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        handleVisibleVerifyModal(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <CustomerModifiesProfile
      loading={infoLoading}
      data={details}
      extra={
        <>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVisibleVerifyModal(true)}>
            提交
          </Button>

          <VerifyModal
            visible={visibleVerifyModal}
            onClose={() => handleVisibleVerifyModal(false)}
            submitLoading={submitLoading}
            onSubmit={handleSubmit}
          />
        </>
      }
    />
  )
}

export default CustomerModifiesConfirmVerify
