import { CardWrapper } from '@apps/components'
import React, { useMemo } from 'react'
import styles from './index.less'
import { Button } from '@linkseeks/ui'
import StatusTag from '@/components/StatusTag'
import { useAuthenticationContext } from '@apps/services/eAccount'
import { postPayAllInPaySignContract, postPayAllInPaySignContractQuery } from '@apps/apis'
import { useHistory } from '@linkseeks/router-core'

const AgreementStep = () => {
  const { memberInfo, isDisabledStepBtn, step, isEnterprise } = useAuthenticationContext()
  const history = useHistory()
  const goSign = async () => {
    const res = await postPayAllInPaySignContract({
      jumpPageType: 1,
      source: 1,
      jumpUrl: location.href,
    })

    location.href = res.data
  }

  const goNo = async () => {
    const { data } = await postPayAllInPaySignContractQuery({
      jumpUrl: location.href,
      // 企业会员就传3，否则是个人会员就传1
      accountType: isEnterprise ? 3 : 1,
    })
    location.replace(data)
  }
  const handleSubmit = () => {
    history.replace('/payandSettle/capitalAccounts/eAccount')
  }

  const renderTitle = useMemo(() => {
    return step === 3 ? '已签署' : '待签署'
  }, [step])

  const renderStatus = useMemo(() => {
    return step === 3 ? 'success' : 'default'
  }, [step])

  const renderNo = useMemo(() => {
    return step === 3 ? (
      <Button type="link" onClick={goNo}>
        查看协议-{memberInfo?.acctProtocolNo} &gt;
      </Button>
    ) : (
      <Button type="link" onClick={goSign}>
        前往签署 &gt;
      </Button>
    )
  }, [step, memberInfo])
  return (
    <CardWrapper title="提现协议签署" extra={<StatusTag type={renderStatus} title={renderTitle} />}>
      <div className={styles['container']}>
        <div className={styles['agreement-container']}>
          <div>电子协议签署</div>
          {renderNo}
        </div>
        <div className={styles['bottom-ctl-container']}>
          <Button type="primary" style={{ width: 250 }} onClick={handleSubmit} disabled={isDisabledStepBtn}>
            完成认证
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}

export default AgreementStep
