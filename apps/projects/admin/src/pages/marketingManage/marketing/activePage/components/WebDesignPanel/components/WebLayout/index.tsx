import React from 'react'
import TopBar from './topbar'
import Search from './search'
import styles from './index.less'
import Tabs from './tabs'

/**
 * WEB 装修页布局组件
 */
interface Iprops {
  children: React.ReactNode
  backgroundColor: string
  logo?: string
}

const WebLayout: React.FC<Iprops> = (props: Iprops) => {
  const { children, backgroundColor, logo } = props
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <TopBar />
        <Search logo={logo} />
        <Tabs />
      </div>
      <div className={styles.content} style={{ background: backgroundColor }}>
        {children}
      </div>
      <div className={styles.footer}></div>
    </div>
  )
}

export default WebLayout
