import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import ReturnEle from '@/components/ReturnEle'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import VerifyPanel from '../VerifyPanel'
import EditAccountContext from '../../context/EditAccountContext'
import ResetPayCode from '../VerifyPanel/Panel/ResetPayCode'
import { getMemberSecurityGet } from '@apps/apis'
import { decryptedEmail, decryptedPhone } from '@apps/utils'

const getData = async () => {
  const res = await getMemberSecurityGet()
  return res.data
}

interface accountProps {
  userId?: number | string | null
  phone?: string
  email?: string
  hasPayPassword?: number // 0 | 1
}

const EditAccount = (props) => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const pathnameSplit = pathname.split('/')
  const length = pathnameSplit.length
  const type = pathnameSplit[length - 1] || 'loginPwd'
  const [account, setAccount] = useState<accountProps>({})

  const MAP = {
    loginPwd: intl.formatMessage({ id: 'accountSetting.modifyLoginPsw' }),
    email: account.email
      ? intl.formatMessage({ id: 'accountSetting.modifyEmail' })
      : intl.formatMessage({ id: 'accountSetting.setEmail' }),
    phone: intl.formatMessage({ id: 'accountSetting.modifyPhone' }),
    paycode: account.hasPayPassword
      ? intl.formatMessage({ id: 'accountSetting.resetPayPsw' })
      : intl.formatMessage({ id: 'accountSetting.setPayPsw' }),
  }
  useEffect(() => {
    async function init() {
      const res = await getData()
      setAccount(res)
    }
    init()
  }, [])
  return (
    <PageHeaderWrapper backDom title={MAP[type]}>
      <Card>
        {type === 'paycode' ? (
          <ResetPayCode phone={decryptedPhone(account.phone)} pageType={type} />
        ) : (
          <EditAccountContext.Provider
            value={{
              phone: decryptedPhone(account.phone),
              email: decryptedEmail(account.email),
              hasPaycode: !!account.hasPayPassword,
              pageType: type,
            }}
          >
            <VerifyPanel />
          </EditAccountContext.Provider>
        )}
      </Card>
    </PageHeaderWrapper>
  )
}

export default EditAccount
