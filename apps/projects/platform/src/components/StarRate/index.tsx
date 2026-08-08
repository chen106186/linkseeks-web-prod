import React from 'react'
import { Rate } from 'antd'
import styles from './index.less'

interface StarRatePropsType {
  value: number,
  showValue?: boolean
}

const StarRate: React.FC<StarRatePropsType> = (props) => {
  const { value, showValue } = props

  return (
    <label className={styles.star_rate}>
      {
        showValue && <span className={styles.star_rate_value}>{value}</span>
      }
      <Rate className={styles.star} count={5} disabled defaultValue={value} />
    </label>
  )
}

StarRate.defaultProps = {
  showValue: true
}

export default StarRate
