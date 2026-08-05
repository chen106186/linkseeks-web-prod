import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import styles from './projectItem.less'

interface Iprops {
  name: string
  count: number
}

const ProjectItem: React.FC<Iprops> = (props: Iprops) => {
  const { name, count } = props
  const intl = useIntl()
  return (
    <div className={styles.container}>
      <span className={styles.count}>3</span>
      <span className={styles.name}>
        {intl.formatMessage({
          id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.purchaseContractExpired',
        })}
      </span>
    </div>
  )
}

export default ProjectItem
