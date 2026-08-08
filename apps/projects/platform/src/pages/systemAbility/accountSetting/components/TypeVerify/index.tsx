import React from 'react'
import styles from './index.less'
import { Link } from '@linkseeks/router-core'
import {
  RealnameOtherIcon,
  EmailOtherIcon,
  TelephoneOtherIcon,
  PasswordOtherIcon,
  PayCodeOtherIcon,
  LogoffOtherIcon,
} from '@linkseeks/icons'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
const intl = getIntl()

const TITLE_NAP = {
  loginPwd: {
    title: `${intl.formatMessage({ id: 'accountSetting.loginPsw' })}`,
    desc: `${intl.formatMessage({ id: 'accountSetting.adviseChangePsw' })}`,
  },
  email: {
    title: `${intl.formatMessage({ id: 'accountSetting.emailVerify' })}`,
    desc: `${intl.formatMessage({ id: 'accountSetting.yourVerifyEmail' })}{{email}}`,
  },
  phone: {
    title: `${intl.formatMessage({ id: 'accountSetting.mobileVerify' })}`,
    desc: `${intl.formatMessage({ id: 'accountSetting.yourVerifyPhone' })}{{phone}},${intl.formatMessage({
      id: 'accountSetting.ifLossTochange',
    })}`,
  },
  paycode: {
    title: `${intl.formatMessage({ id: 'accountSetting.payPsw' })}`,
    desc: `${intl.formatMessage({ id: 'accountSetting.pswStartToUpdate' })}`,
  },
  realname: {
    title: intl.formatMessage({ id: 'accountSetting.certified2' }),
    desc: intl.formatMessage({ id: 'accountSetting.certified3' }),
  },
  accountOff: {
    title: intl.formatMessage({ id: 'accountSetting.accountOff' }),
    desc: intl.formatMessage({ id: 'accountSetting.accountOffDesc' }),
  },
}

interface IProps {
  email: string
  phone: string
  paycode: number // 0 | 1
  isAuth: boolean // 1 | 2
  type: 'loginPwd' | 'email' | 'phone' | 'paycode' | 'realname' | 'accountOff'
}

const Icons = {
  loginPwd: <PasswordOtherIcon size={72} />,
  email: <EmailOtherIcon size={72} />,
  phone: <TelephoneOtherIcon size={72} />,
  paycode: <PayCodeOtherIcon size={72} />,
  realname: <RealnameOtherIcon size={72} />,
  accountOff: <LogoffOtherIcon size={72} />,
}

const TypeVerify: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { type, email, phone, paycode, isAuth } = props
  const titleRender = () => {
    return TITLE_NAP[type].title
  }
  const descRender = () => {
    if (type == 'email' && email == '') {
      return intl.formatMessage({ id: 'accountSetting.notBoundEmail' })
    } else if (type == 'paycode' && paycode == 0) {
      return intl.formatMessage({ id: 'accountSetting.notSettingPsw' })
    }

    return TITLE_NAP[type].desc.replace(/\{\{(.*?)\}\}/, (match, key) => {
      return props[key]
    })
  }

  const renderLink = () => {
    let title = intl.formatMessage({ id: 'accountSetting.modify' })
    if (type == 'email' && email == '') {
      title = intl.formatMessage({ id: 'accountSetting.setEmail' })
    } else if (type == 'paycode') {
      title =
        paycode == 0
          ? intl.formatMessage({ id: 'accountSetting.setPayPsw' })
          : intl.formatMessage({ id: 'accountSetting.resetPayPsw' })
    } else if (type == 'realname') {
      title = Boolean(isAuth)
        ? intl.formatMessage({ id: 'accountSetting.certified1' })
        : intl.formatMessage({ id: 'accountSetting.certified2' })
    } else if (type === 'accountOff') {
      title = intl.formatMessage({ id: 'accountSetting.accountOff' })
    }
    return <Link to={`/systemAbility/accountSetting/${type}`}>{title}</Link>
  }

  return (
    <div className={styles.container}>
      <div className={styles.infos}>
        <div className={styles.image}>{Icons[type]}</div>
        <div className={styles.details}>
          <p className={styles.title}>{titleRender()}</p>
          <p className={styles.tips}>{descRender()}</p>
        </div>
      </div>
      <AuthButton type="custom" code={type}>
        <div className={styles.controls}>{renderLink()}</div>
      </AuthButton>
    </div>
  )
}

export default TypeVerify
