/*
 * @Author: your name
 * @Date: 2020-10-21 15:59:41
 * @desc：确认对账完成
 */

import React from 'react'
import { useIntl } from '@linkseeks/i18n'

interface Iprops {
  /**
   * 结算日期
   */
  settlementDate: string

  /**
   * 付款方
   */
  payName: string
}

const ConfirmAccount: React.FC<Iprops> = (props) => {
  const { settlementDate, payName } = props
  const intl = useIntl()
  return (
    <div>
      <div style={{ margin: 0 }}>{intl.formatMessage({ id: 'balance.components.confirmAccount.h3' })}</div>
      <div style={{ margin: '24px 0' }}>
        <span style={{ color: '#909399', width: '60px', display: 'inline-block' }}>
          {intl.formatMessage({ id: 'balance.components.confirmAccount.text.1' })}
        </span>
        <span>{settlementDate}</span>
      </div>
      <div>
        <span style={{ color: '#909399', width: '60px', display: 'inline-block' }}>
          {intl.formatMessage({ id: 'balance.components.confirmAccount.text.2' })}
        </span>
        <span>{payName}</span>
      </div>
    </div>
  )
}

export default ConfirmAccount
