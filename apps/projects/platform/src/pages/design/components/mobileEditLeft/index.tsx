import React from 'react'
import { ModuleTree } from '@apps/design-react'
import { useWebIntl } from '@apps/locales'
import styles from './index.less'

const MobileEditLeft = () => {
  const translate = useWebIntl()

  return (
    <div className={styles.allcomponents_container}>
      <div className={styles.header}>
        <span>{translate('web.resource.shop.wodemokuai')}</span>
      </div>
      <div className={styles.components_list}>
        <ModuleTree />
      </div>
    </div>
  )
}

export default MobileEditLeft
