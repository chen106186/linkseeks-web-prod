import React from 'react'
import classNames from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { openLink } from '@/utils'
import { ConfigConsumer } from '../Generator'
import styles from './index.module.less'

interface FloorHeaderProps {
  className?: string
  prefixCls?: string
  shopNum?: number
  goodsNum?: number
  linkdisable?: boolean
  shopsLinkUrl: string
  linkUrl: string
  headerTitle?: string
  pieceTitle?: string
  shopTitle?: string
  children?: React.ReactNode
}

export class FloorHeader extends React.Component<FloorHeaderProps, {}> {
  renderComponent = () => {
    const {
      children,
      className,
      shopNum = 0,
      headerTitle = '',
      pieceTitle = '',
      shopTitle = '',
      linkdisable = false,
      shopsLinkUrl,
      linkUrl,
      goodsNum = 0,
      ...others
    } = this.props
    const classString = classNames(styles['lingxi-floor-line-header'], className)
    const translate = getWebIntl()

    return (
      <section className={classString} {...others}>
        <div className={styles['floor-line-header-count-info']}>
          <div
            className={styles['floor-line-header-count-info-item']}
            onClick={() => openLink(shopsLinkUrl, linkdisable)}
          >
            <span>{shopNum}</span>
            <label>{headerTitle || translate('web.resource.mall.store')} &gt;</label>
          </div>
          <div className={styles['floor-line-header-count-info-item']} onClick={() => openLink(linkUrl, linkdisable)}>
            <span>{goodsNum}</span>
            <label>
              {pieceTitle || translate('web.common.ge')}
              {shopTitle || translate('web.resource.mall.commodity')} &gt;
            </label>
          </div>
          {children}
        </div>
      </section>
    )
  }

  render() {
    return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>
  }
}
