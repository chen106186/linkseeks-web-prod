import React from 'react'
import { ModuleTree } from '@apps/design-react'
import styles from './index.less'

const MobileEditLeft = () => {
  return (
    <div className={styles.allcomponents_container}>
      <div className={styles.header}>
        <span>我的模块</span>
      </div>
      <div className={styles.components_list}>
        <ModuleTree />
      </div>
    </div>
  )
}

export default MobileEditLeft
