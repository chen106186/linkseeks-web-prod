/*
 * @Description: 审核供应商变更(二级)
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { postMemberSupplierModifyGradeTwo, getMemberSupplierModifyGradeTwoDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'

const SupplierModifyGradeTwoVerify: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postMemberSupplierModifyGradeTwo(
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

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierModifyGradeTwoDetail({ validateId }), {
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
      showNew
    />
  )
}

export default SupplierModifyGradeTwoVerify
