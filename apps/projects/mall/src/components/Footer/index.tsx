import React from 'react'
import useHistory from '@/hooks/useHistory'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import useCopyRight from '@/hooks/useCopyRight'
import useHelpInfo, { HelpType } from './hooks/useHelpInfo'
import styles from './index.module.less'

const Footer: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const { footerNavList } = useHelpInfo(mallInfo?.id)
  const { copyRightText, copyRightUrl } = useCopyRight()
  const COLUMN_COUNT = 8
  const history = useHistory()
  const translate = getWebIntl()

  const tapPath = (info: HelpType) => {
    // 站内
    if (info.skipType === 1) {
      history.push(`/helpCenter/${info.id}`)
    }
    // 外链
    if (info.skipType === 2 && info.skipUrl) {
      window.open(info.skipUrl)
    }
  }

  const linkMore = (id?: number) => {
    history.push(`/helpCenter${id ? `/${id}` : ''}`)
  }

  return (
    <div className={styles.footer} id="footer">
      {footerNavList && footerNavList.length > 0 && (
        <div className={styles['footer_container']}>
          {footerNavList.map(
            (item, index) =>
              index < COLUMN_COUNT && (
                <ul className={styles['footer_nav_item']} key={`footer_nav_item_${index}`}>
                  <li className={styles.title}>{item.name}</li>
                  {item.children &&
                    item.children.length > 0 &&
                    item.children.map(
                      (childItem, index) =>
                        index < COLUMN_COUNT && (
                          <li className={styles.subtitle} key={`footer_nav_item_${index}`}>
                            <span onClick={() => tapPath(childItem)}>{childItem.name}</span>
                          </li>
                        ),
                    )}
                  {item.children && item.children.length > COLUMN_COUNT && (
                    <li className={styles.subtitle} key={`footer_nav_item_${index}`}>
                      <span onClick={() => linkMore(item.id)}>{translate('web.common.more')}…</span>
                    </li>
                  )}
                </ul>
              ),
          )}
          {footerNavList.length > COLUMN_COUNT && (
            <ul className={styles['footer_nav_item']}>
              <li className={cx(styles.title, styles.more)} onClick={() => linkMore()}>
                {translate('web.resource.mall.gengduobangzhu')} &gt;
              </li>
            </ul>
          )}
        </div>
      )}
      <div className={styles.copyright}>
        <a href={copyRightUrl || 'javascript:;'}>{copyRightText || translate('web.common.copyright')}</a>
      </div>
    </div>
  )
}

export default Footer
