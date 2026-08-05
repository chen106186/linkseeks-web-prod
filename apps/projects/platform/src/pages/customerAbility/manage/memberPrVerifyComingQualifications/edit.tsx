/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 11:40:27
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 15:46:00
 * @Description: 审核入库资质
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { postMemberDepositQualify, getMemberDepositQualifyDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'

const MemberPrVerifyComingQualificationsDetail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postMemberDepositQualify(
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

  const { data: dataSource, loading } = useHttpRequest(() => getMemberDepositQualifyDetail({ validateId }), {
    manual: false,
  })

  return (
    <MemberProfile
      dataSource={dataSource}
      loading={loading}
      extra={() => (
        <>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVisibleVerifyModal(true)}>
            {intl.formatMessage({ id: 'customerAbility.actions.apply.verify' })}
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

export default MemberPrVerifyComingQualificationsDetail
