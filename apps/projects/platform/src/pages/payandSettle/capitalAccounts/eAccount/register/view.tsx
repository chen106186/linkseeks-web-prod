import { PageHeaderWrapper } from '@apps/components'
import { InitRegisterContextProvider } from './context'
import { Button, Card, Form, Input, Steps } from '@linkseeks/ui'
import { CardWrapper, FormItemWrapper, FormLayoutWrapper } from '@apps/components'
import AuthStep from './components/AuthStep'
import styles from './index.less'
import { AuthenticationProvider, useAuthenticationContext } from '@apps/services/eAccount'
import BankStep from './components/BankStep'
import AgreementStep from './components/AgreementStep'

const Register = () => {
  const [AuthForm] = Form.useForm()
  const [BankForm] = Form.useForm()
  const { step, readyLoading } = useAuthenticationContext()
  const items = [{ title: '个人实名' }, { title: '绑定银行卡' }, { title: '提现协议' }]

  return (
    <PageHeaderWrapper loading={readyLoading}>
      <CardWrapper>
        <Steps items={items} current={step}></Steps>
      </CardWrapper>
      <div className={styles['container']}>
        {step === 0 && <AuthStep form={AuthForm} />}
        {step === 1 && <BankStep form={BankForm} />}
        {(step === 2 || step === 3) && <AgreementStep />}
      </div>
    </PageHeaderWrapper>
  )
}

export default () => {
  return (
    <AuthenticationProvider>
      <InitRegisterContextProvider>
        <Register />
      </InitRegisterContextProvider>
    </AuthenticationProvider>
  )
}
