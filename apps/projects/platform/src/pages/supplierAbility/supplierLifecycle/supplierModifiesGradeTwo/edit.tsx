/*
 * @Description: 审核变更申请单(二级)
 */
import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberSupplierLifecycleSummaryDetail, postMemberSupplierLifecycleWaitAuditTwoAudit } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import SupplierModifiesProfile from '../components/SupplierModifiesProfile'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'

const SupplierModifiesGradeTwoVerify: React.FC<any> = (props) => {
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { id } = usePageStatus()

  const intl = useIntl()

  const { data: details, loading: infoLoading } = useHttpRequest(
    () => getMemberSupplierLifecycleSummaryDetail({ id }),
    { manual: false },
  )

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postMemberSupplierLifecycleWaitAuditTwoAudit(
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
    <SupplierModifiesProfile
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

export default SupplierModifiesGradeTwoVerify
