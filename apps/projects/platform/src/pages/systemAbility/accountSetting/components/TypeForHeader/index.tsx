import React from 'react'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

interface Iprops {
  phone?: string
}

const TypeForHeader = (props) => {
  const intl = useIntl()
  const { type = 'phone', phone, email } = props

  const phoneRender = () => {
    return (
      <>
        <div className={styles.title}>{intl.formatMessage({ id: 'accountSetting.currentlyBoundPhoneNumble' })}</div>
        <div className={styles.value}>{phone}</div>
      </>
    )
  }

  const emailRender = () => {
    return (
      <>
        <div className={styles.title}>{intl.formatMessage({ id: 'accountSetting.CurrentlyAuthenticatedMailbox' })}</div>
        <div className={styles.value}>{email}</div>
      </>
    )
  }
  const payCodeRender = () => {
    return null
  }

  const selectTypeRender = () => {
    const { type = 'phone' } = props
    if (type == 'phone') {
      return phoneRender()
    } else if (type == 'email') {
      return emailRender()
    } else {
      return payCodeRender()
    }
  }

  return <div className={styles.header}>{selectTypeRender()}</div>
}

export default TypeForHeader
