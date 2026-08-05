import React from 'react'
import cx from 'classnames'
import { useWebIntl } from '@apps/locales'
import { useCopyRight } from '@apps/services'
import styles from '../styles/UserLayouts.less'

const BaseFooter: React.FC = () => {
  const translate = useWebIntl()
  const { copyRightText } = useCopyRight()
  return <footer className={cx(styles['user-footer'])}>{copyRightText || translate('web.common.copyright')}</footer>
}

export default BaseFooter
