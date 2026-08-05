import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import styles from './index.less'
import { openLink } from '../../utils'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { FloorLineLocale } from '../../locale/types/floorline'

interface FloorHeaderProps {
  className?: string
  prefixCls?: string
  shopNum?: number
  goodsNum?: number
  linkdisable?: boolean
  shopsLinkUrl: string
  linkUrl: string
  shopTitle?: string
  goodsTitle?: string
}

const FloorHeader: React.FC<PropsWithChildren<FloorHeaderProps>> = (props) => {
  const classString = classNames(styles['lingxi-floor-line-header'])

  const renderComponent = (locale: FloorLineLocale) => {
    const {
      children,
      className,
      shopNum = 0,
      linkdisable = false,
      shopsLinkUrl,
      linkUrl,
      goodsTitle = locale['goods.title'],
      shopTitle = locale['shop.title'],
      goodsNum = 0,
      ...others
    } = props

    return (
      <section className={classString} {...others}>
        <div className={styles['floor-line-header-count-info']}>
          <div
            className={styles['floor-line-header-count-info-item']}
            onClick={() => openLink(shopsLinkUrl, linkdisable)}
          >
            <span>{shopNum}</span>
            <label>{shopTitle} &gt;</label>
          </div>
          <div
            className={styles['floor-line-header-count-info-item']}
            onClick={() => openLink(linkUrl, linkdisable)}
          >
            <span>{goodsNum}</span>
            <label>{goodsTitle} &gt;</label>
          </div>
          {children}
        </div>
      </section>
    )
  }

  return (
    <LocaleReceiver componentName="FloorLine">{renderComponent}</LocaleReceiver>
  )
}

export default FloorHeader
