import React, { useContext } from 'react'
import { Tabs } from 'antd'
import PhoneVerifyPanel from './PhoneVerifyPanel'
import PaycodeVerifyPanel from './PaycodeVerifyPanel'
import EmailVerifyPanel from './EmailVerifyPanel'
import EditAccountContext from '../../../context/EditAccountContext'
import { useIntl } from '@linkseeks/i18n'

const { TabPane } = Tabs

interface Iprops {}

const VerifyPanel: React.FC<Iprops> = (props) => {
  const intl = useIntl()
  const { phone, email, hasPaycode, pageType } = useContext(EditAccountContext)
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={intl.formatMessage({ id: 'accountSetting.phoneCodeVerify' })} disabled={phone == ''} key="1">
        <PhoneVerifyPanel phone={phone} pageType={pageType} />
      </TabPane>
      <TabPane tab={intl.formatMessage({ id: 'accountSetting.emailVerify' })} disabled={email == ''} key="2">
        <EmailVerifyPanel email={email} pageType={pageType} />
      </TabPane>
      <TabPane tab={intl.formatMessage({ id: 'accountSetting.payPswVerify' })} disabled={!hasPaycode} key="3">
        <PaycodeVerifyPanel pageType={pageType} />
      </TabPane>
    </Tabs>
  )
}

export default VerifyPanel
