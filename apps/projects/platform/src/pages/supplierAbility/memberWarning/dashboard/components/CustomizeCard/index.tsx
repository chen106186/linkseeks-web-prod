import React, { useMemo } from 'react'
import { Card } from 'antd'
import styles from './index.less'

type PropsNew = React.ComponentProps<typeof Card>

const CustomizeCard: React.FC<PropsNew> = (props: PropsNew) => {
  const { title, loading, extra, children, bodyStyle, ...rest } = props

  if (loading) {
    return <Card loading={loading}></Card>
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.extra}>{extra}</div>
      </div>
      <div className={styles.body} style={bodyStyle}>
        {children}
      </div>
    </div>
  )
}

CustomizeCard.defaultProps = {
  loading: false,
  extra: null,
}

export default CustomizeCard
