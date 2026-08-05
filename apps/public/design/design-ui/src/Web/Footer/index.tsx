import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@apps/locales'
import useHelpInfo, { HelpType } from './hooks/useHelpInfo'
import useCopyRight from './hooks/useCopyRight'
import { getPrefixUrl, openLink } from '../../utils'
import styles from './index.less'

export interface ConnectItemType {
  sort: number
  icon: string
  title: string
  content: string
}

interface FooterPorps {
  shopId: number
  className?: string
  backgroundColor?: string
  fontColor?: string
  linkdisable?: boolean
  title?: string
  connectList?: ConnectItemType[]
  imageList?: Array<{ url: string }>
}

const Footer: React.FC<FooterPorps> = (props) => {
  const {
    shopId,
    className,
    backgroundColor = '#646A78',
    fontColor = '#FFFFFF',
    linkdisable,
    title,
    connectList,
    imageList,
    ...others
  } = props
  const translate = getWebIntl()
  const COLUMN_COUNT =
    title ||
    (Array.isArray(connectList) && connectList.length > 0) ||
    (Array.isArray(imageList) && imageList.length > 0)
      ? 6
      : 8
  const ROWS_COUNT = 6
  const { footerNavList } = useHelpInfo(shopId)
  const { copyRightText, copyRightUrl } = useCopyRight()
  const prefixUrl = getPrefixUrl(true)

  const wrapperStyle: React.CSSProperties = {
    backgroundColor,
    color: fontColor,
  }

  const tapPath = (info: HelpType) => {
    // 站内
    if (info.skipType === 1) {
      openLink(`${prefixUrl}/helpCenter/${info.id}`, linkdisable)
    }
    // 外链
    if (info.skipType === 2 && info.skipUrl) {
      openLink(info.skipUrl, linkdisable, '_blank')
    }
  }

  const linkMore = (id?: number) => {
    openLink(`${prefixUrl}/helpCenter${id ? `/${id}` : ''}`, linkdisable)
  }

  return (
    <div
      className={cx(styles.footer, className)}
      style={wrapperStyle}
      id="footer"
      {...others}
    >
      <div className={styles.footer_container}>
        <div className={styles['footer-help-list']}>
          {footerNavList &&
            footerNavList.map(
              (item, index) =>
                index < COLUMN_COUNT && (
                  <ul
                    className={styles.footer_nav_item}
                    key={`footer_nav_item_${index}`}
                  >
                    <li className={styles.title}>{item.name}</li>
                    {item.children &&
                      item.children.map(
                        (childItem, childIndex) =>
                          childIndex < COLUMN_COUNT && (
                            <li
                              key={`footer_nav_item_${childIndex}`}
                              className={styles.subtitle}
                            >
                              <span onClick={() => tapPath(childItem)}>
                                {childItem.name}
                              </span>
                            </li>
                          ),
                      )}
                    {item.children && item.children.length > ROWS_COUNT && (
                      <li
                        className={styles.subtitle}
                        key={`footer_nav_item_${index}`}
                      >
                        <span onClick={() => linkMore(item.id)}>
                          {translate('web.common.more' as never)}…
                        </span>
                      </li>
                    )}
                  </ul>
                ),
            )}
        </div>
        {(title || (connectList && connectList.length > 0)) && (
          <div className={styles['footer-content-wrap']}>
            <div className={styles['footer-content-title']}>{title}</div>
            <div className={styles['footer-content-list']}>
              {connectList &&
                connectList.map((item, index) => (
                  <div
                    className={styles['footer-content-list-item']}
                    key={`connect-${index}`}
                  >
                    <img
                      className={styles['footer-content-list-item-icon']}
                      src={item.icon}
                    />
                    <label>{item.title}</label>
                    <span>{item.content}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {imageList && (
          <div className={styles['footer-img-wrap']}>
            <div className={styles['footer-img-list']}>
              {imageList.map((item, index) => (
                <div
                  className={styles['footer-img-list-item']}
                  key={`image-${index}`}
                >
                  <img
                    className={styles['footer-img-list-item-img']}
                    src={item.url}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.copyright}>
        <a target="_blank" href={copyRightUrl || 'javascript:;'}>
          {copyRightText || '全链数字化解决方案'}
        </a>
      </div>
    </div>
  )
}

export default Footer
