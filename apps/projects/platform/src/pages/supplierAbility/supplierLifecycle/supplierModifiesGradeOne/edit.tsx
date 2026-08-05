/*
 * @Description: 审核变更申请单(一级)
 */
import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import { postMemberSupplierLifecycleWaitAuditOneAudit, getMemberSupplierLifecycleSummaryDetail } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import SupplierModifiesProfile from '../components/SupplierModifiesProfile'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'
import { useWebIntl } from '@apps/locales'

const SupplierModifiesGradeOneVerify: React.FC<any> = (props) => {
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { id } = usePageStatus()

  const translate = useWebIntl()

  const { data: details, loading: infoLoading } = useHttpRequest(
    () => getMemberSupplierLifecycleSummaryDetail({ id }),
    { manual: false },
  )

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postMemberSupplierLifecycleWaitAuditOneAudit(
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
            {translate('web.common.submit')}
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

export default SupplierModifiesGradeOneVerify
