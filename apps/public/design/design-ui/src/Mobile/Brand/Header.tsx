import React from 'react'
import cx from 'classnames'
import styles from './styles.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'

interface BrandHeader {
  /** 标题 */
  title?: string
  /** 标题说明 */
  explain?: string
  className?: string
}

const BrandHeader: React.FC<BrandHeader> = (props) => {
  const renderComponent = (locale: MobileLocale) => {
    const {
      title = locale['mobile.brand.title'],
      explain = locale['mobile.brand.explain'],
      className,
      ...others
    } = props

    return (
      <div className={cx(styles[`lingxi-brand-header`], className)} {...others}>
        <div className={styles[`lingxi-brand-header-title`]}>
          {title}
          <span className={styles[`lingxi-brand-header-info`]}>{explain}</span>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default BrandHeader
