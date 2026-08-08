import React from 'react'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import styles from './activityItem.less'

interface Iprops {
  id: number
  activityName: string
  activityTypeName: string
  statusName: string
  isActive: boolean
  onSelect?: ((id: number) => void) | null
  hasChildSelected?: boolean
  activityImage: string
}

const ActivityItem: React.FC<Iprops> = (props: Iprops) => {
  const {
    id,
    activityName,
    activityTypeName,
    statusName,
    isActive = false,
    onSelect = null,
    hasChildSelected = false,
    activityImage,
  } = props

  const triggerSelect = () => {
    onSelect?.(id)
  }

  const mergeClasses = cx(styles.section, {
    [styles.indeterminate]: hasChildSelected,
    [styles.active]: isActive,
  })

  return (
    <div onClick={triggerSelect} className={mergeClasses}>
      <img className={styles.img} src={activityImage} />
      <div className={styles.info}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>{activityName}</span>
          <StatusTag title={statusName} type="success" />
        </div>
        <div className={styles.footer}>
          <span className={styles.id}>ID: {id}</span>
          <StatusTag type="default" title={activityTypeName} />
        </div>
      </div>
    </div>
  )
}

export default ActivityItem
