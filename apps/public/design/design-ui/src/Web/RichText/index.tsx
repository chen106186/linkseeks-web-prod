import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@apps/locales'
import styles from './index.less'

interface IProps {
  html?: string
  className?: string
}

const RichText: React.FC<IProps> = (props) => {
  const { className, html, ...others } = props
  const translate = getWebIntl()

  const classNameString = cx(styles['rich-text'], className)

  return (
    <div className={classNameString} {...others}>
      {html ? (
        <p dangerouslySetInnerHTML={{ __html: html }}></p>
      ) : (
        <div className={styles['rich-text-empty']}>
          {translate('web.resource.shop.fuwenben')}
        </div>
      )}
    </div>
  )
}

export default RichText
