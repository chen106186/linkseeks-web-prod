import React from 'react'
import styles from './tabs.less'

const Tabs = () => {
  const tabList = [
    { title: '商城首页' },
    { title: '现货商品' },
    { title: '询价商品' },
    { title: '优选店铺' },
    { title: '积分商品' },
    { title: '行情资讯' },
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
