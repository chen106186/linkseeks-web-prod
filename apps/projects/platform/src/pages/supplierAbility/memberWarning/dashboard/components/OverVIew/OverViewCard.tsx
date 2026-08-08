import React from 'react'
import { Card } from 'antd'
import styles from './index.less'
import cx from 'classnames'
import CustomizeCard from '../CustomizeCard'

interface Iprops {
  icon?: any
  title: string
  total: number
  /** 一级 */
  first: number
  second: number
  third: number
  loading?: boolean
  type: 'warn' | 'primary' | 'success' | 'default'
}

const OverViewCard: React.FC<Iprops> = (props: Iprops) => {
  const { loading, title, total, first, second, third, type } = props
  return (
    <CustomizeCard title={title} loading={loading} bodyStyle={{ paddingTop: '8px' }}>
      <div className={styles.section}>
        <div className={cx(styles.icon, styles[type])}></div>
        <span className={styles.total}>{total}</span>
      </div>
      <div className={styles.progress}>
        <div className={cx(styles.first, styles.progressItem)} style={{ flex: first }}>
          {first}
        </div>
        <div className={cx(styles.second, styles.progressItem)} style={{ flex: second }}>
          {second}
        </div>
        <div className={cx(styles.third, styles.progressItem)} style={{ flex: third }}>
          {third}
        </div>
      </div>
    </CustomizeCard>
  )
}

export default OverViewCard
