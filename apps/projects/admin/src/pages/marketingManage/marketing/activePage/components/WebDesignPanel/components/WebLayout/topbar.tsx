import React from 'react'
import styles from './topbar.less'

const TopBar = () => {
  const rightLayoutList = [{ title: '免费注册' }, { title: '会员中心' }, { title: '我的消息' }, { title: '客户服务' }]

  return (
    <div className={styles.topBar}>
      <div className={styles['topBar-content']}>
        <div>
          <div>企业商城</div>
        </div>
        <div className={styles.right}>
          <div className={styles.toLogin}>你好，请登录</div>
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
