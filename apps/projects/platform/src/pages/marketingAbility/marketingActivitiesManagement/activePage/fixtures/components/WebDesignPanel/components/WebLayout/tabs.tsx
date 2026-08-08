import React from 'react'
import { useWebIntl } from '@apps/locales'
import styles from './tabs.less'

const Tabs = () => {
  const translate = useWebIntl()
  const tabList = [
    { title: translate('web.resource.marketing.shangchengshouye') },
    { title: translate('web.resource.marketing.xianhuoshangpin') },
    { title: translate('web.resource.marketing.xunjiashangpin') },
    { title: translate('web.resource.marketing.youxuandianpu') },
    { title: translate('web.resource.marketing.jifenshangpin') },
    { title: translate('web.resource.marketing.hangqingzixun') },
  ]
  return (
    <div className={styles.tabList}>
      {tabList.map((_item, _key) => {
        return (
          <div className={styles.tabItem} key={_key}>
            {_item.title}
          </div>
        )
      })}
      <span></span>
    </div>
  )
}

export default Tabs
