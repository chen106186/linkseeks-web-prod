/*
 * @Description: 待审核入库考察-审核
 */
import React, { useState } from 'react'
import { Button, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerDepositInspectDetail, postMemberCustomerDepositInspect } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'
import VerifyComingInvestigateDrawer, { ValueType } from './components/VerifyComingInvestigateDrawer'

const CustomerDepositInspectVerify: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [visibleVerifyDrawer, setVisibleVerifyDrawer] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleVisibleVerifyDrawer = (flag?) => {
    setVisibleVerifyDrawer(!!flag)
  }

  const handleSubmit = (value: ValueType) => {
    setSubmitLoading(true)
    const payload = {
      validateId,
      ...value,
      reports: value.reports.map((item) => ({
        url: item.url,
        name: item.name,
      })),
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.management.common.commiting' }),
      duration: 0,
    })
    postMemberCustomerDepositInspect(payload, {
      timeout: 0,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        handleVisibleVerifyDrawer(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        msg()
        setSubmitLoading(false)
      })
  }

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerDepositInspectDetail({ validateId }), {
    manual: false,
  })

  return (
    <MemberProfile
      dataSource={dataSource}
      loading={loading}
      extra={() => (
        <>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVisibleVerifyDrawer(true)}>
            {intl.formatMessage({ id: 'member.actions.apply.verify' })}
          </Button>

          <VerifyComingInvestigateDrawer
            visible={visibleVerifyDrawer}
            onClose={() => handleVisibleVerifyDrawer(false)}
            submitLoading={submitLoading}
            onSubmit={handleSubmit}
          />
        </>
      )}
    />
  )
}

export default CustomerDepositInspectVerify
