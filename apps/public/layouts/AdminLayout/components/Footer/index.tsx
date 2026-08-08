import React from 'react'
import cx from 'classnames'
import { useCopyRight } from '@apps/services'
import styles from './index.less'

const BaseFooter: React.FC = () => {
  const { copyRightText, copyRightUrl } = useCopyRight()
  return (
    <footer className={cx(styles['user-footer'])}>
      <a target="_blank" href={copyRightUrl || 'javascript:;'}>
        {copyRightText || '全链数字化解决方案'}
      </a>
    </footer>
  )
}

export default BaseFooter
