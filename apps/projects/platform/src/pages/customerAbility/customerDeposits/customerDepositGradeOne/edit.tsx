/*
 * @Description: 审核入库(一级)
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { usePageStatus } from '@/hooks/usePageStatus'
import { postMemberCustomerDepositGradeOne, getMemberCustomerDepositGradeOneDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'

const CustomerDepositGradeOneVerify: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postMemberCustomerDepositGradeOne(
      {
        validateId,
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

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerDepositGradeOneDetail({ validateId }), {
    manual: false,
  })

  return (
    <MemberProfile
      dataSource={dataSource}
      loading={loading}
      extra={() => (
        <>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVisibleVerifyModal(true)}>
            {intl.formatMessage({ id: 'member.actions.apply.verify' })}
          </Button>

          <VerifyModal
            visible={visibleVerifyModal}
            onClose={() => handleVisibleVerifyModal(false)}
            submitLoading={submitLoading}
            onSubmit={handleSubmit}
          />
        </>
      )}
    />
  )
}

export default CustomerDepositGradeOneVerify
