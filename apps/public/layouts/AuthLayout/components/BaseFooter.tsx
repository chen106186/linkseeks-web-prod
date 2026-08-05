import React from 'react'
import styles from '../styles/UserLayouts.less'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'

const BaseFooter: React.FC = (props) => {
  const translate = useWebIntl()
  return <footer className={styles['lingxi-business-user-footer']}>{translate('web.common.copyright')}</footer>
}

export default BaseFooter
