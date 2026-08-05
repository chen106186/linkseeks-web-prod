import React from 'react'
import { useWebIntl } from '@apps/locales'
import styles from './topbar.less'

const TopBar = () => {
  const translate = useWebIntl()
  const rightLayoutList = [
    { title: translate('web.resource.marketing.mianfeizhuce') },
    { title: translate('web.resource.home.memberCenter') },
    { title: translate('web.resource.marketing.wodexiaoxi') },
    { title: translate('web.resource.marketing.kehufuwu') },
  ]

  return (
    <div className={styles.topBar}>
      <div className={styles['topBar-content']}>
        <div>
          <div>{translate('web.resource.marketing.qiyeshangcheng')}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.toLogin}>{translate('web.resource.marketing.nihaodenglu')}</div>
          <div className={styles.list}>
            {rightLayoutList.map((_item, _key) => {
              return (
                <div className={styles['list-item']} key={_key}>
                  {_item.title}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
