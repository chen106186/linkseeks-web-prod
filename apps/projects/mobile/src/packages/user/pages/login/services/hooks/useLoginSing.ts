import { useState } from 'react'
import { showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import useLoginForm from './useLoginForm'
import useLogin from './useLogin'
import { useMobileIntl } from '@apps/locales'

type MobileParamsType = {
  account: string
  password: string
  shopType: string
}

const useLoginSing = (agree) => {
  const intl = useIntl()
  const translate = useMobileIntl()
  const { form, setKey } = useLoginForm<MobileParamsType>({
    account: '',
    password: '',
    shopType: '',
  })
  const { onLogin } = useLogin()
  const [type, setType] = useState<boolean>(false)
  const [accountFocus, setAccountFocus] = useState<boolean>(false)
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false)
  const [loginFlag, setLoginFlag] = useState(false)
  /* 请求登录 */
  const login = async () => {
    if (!loginFlag) {
      setLoginFlag(true)
      if (!form.account || !form.password) {
        setLoginFlag(false)
        showToast({
          title: !form.account
            ? intl.formatMessage({ id: 'user.qingshuruyonghuminghuoshou', defaultMessage: '请输入用户名或手机号码' })
            : intl.formatMessage({ id: 'user.qingshurumima', defaultMessage: '请输入密码' }),
          icon: 'none',
        })
        return
      }

      if (!agree) {
        showToast({
          title: translate('mobile.resource.user.qingyueduxieyi'),
          icon: 'none',
        })
        setLoginFlag(false)
        return
      }
      onLogin({ ...form, password: encryptedByAES(form.password) }, 'account').finally(() => {
        setLoginFlag(false)
      })
    }
  }

  return {
    form,
    type,
    accountFocus,
    passwordFocus,
    setType,
    setKey,
    login,
    setAccountFocus,
    setPasswordFocus,
  }
}

export default useLoginSing
