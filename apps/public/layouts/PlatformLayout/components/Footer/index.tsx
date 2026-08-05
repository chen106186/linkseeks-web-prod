import React from 'react'
import cx from 'classnames'
import { useWebIntl } from '@apps/locales'
import { useCopyRight } from '@apps/services'
import styles from './index.less'

const BaseFooter: React.FC = () => {
  const translate = useWebIntl()
  const { copyRightText, copyRightUrl } = useCopyRight()
  return (
    <footer className={cx(styles['user-footer'])}>
      <a target="_blank" href={copyRightUrl || 'javascript:;'}>
        {copyRightText || translate('web.common.copyright')}
      </a>
    </footer>
  )
}

export default BaseFooter
