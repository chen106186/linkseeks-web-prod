import { Card, Col, Row } from 'antd'
import React from 'react'
import cs from 'classnames'
import styles from './index.less'

interface PropsType {
  title?: string | React.ReactNode
  children: React.ReactNode
  cols?: 1 | 2
  id?: string
  subtitle?: string | React.ReactNode
  customStyle?: React.CSSProperties
}

/**
 * 信息布局 Card
 * @param param0
 * @returns
 */
function InfoCard({ title, subtitle, customStyle, children, id, cols = 2 }: PropsType) {
  return (
    <Card
      id={id}
      className={styles.card}
      style={{ ...customStyle }}
      title={
        <div className={styles.title}>
          <div>{title}</div>
          <div>{subtitle}</div>
        </div>
      }
    >
      <div className={cs(styles[`grid-columns-${cols}`])}>{children}</div>
    </Card>
  )
}

export default InfoCard
