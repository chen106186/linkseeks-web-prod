import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import TypeVerify from './components/TypeVerify'
import { getMemberSecurityGet } from '@apps/apis'
import { decryptedEmail, decryptedPhone } from '@apps/utils'
import useAccess from '@apps/services/auth/useAccess'

const getData = async () => {
  ///member/security/get
  const res = await getMemberSecurityGet()
  return res.data
}
const AccountSetting = () => {
  const [account, setAccount] = useState<any>({})
  const { handleAccess } = useAccess()
  useEffect(() => {
    async function init() {
      const res = await getData()
      console.log(res, 'res')
      setAccount(res)
    }
    init()
  }, [])
  const TYPES = ['loginPwd', 'email', 'phone', 'paycode', 'realname', 'accountOff']
  return (
    <PageHeaderWrapper>
      <div>
        <Row gutter={[16, 16]}>
          {TYPES.map((item) => {
            if (!handleAccess(item)) {
              return null
            }
            return (
              <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24} key={item}>
                <TypeVerify
                  type={item as 'phone'}
                  phone={decryptedPhone(account.phone)}
                  email={decryptedEmail(account.email)}
                  paycode={account.hasPayPassword}
                  isAuth={account.isAuth}
                />
              </Col>
            )
          })}
        </Row>
      </div>
    </PageHeaderWrapper>
  )
}

export default AccountSetting
