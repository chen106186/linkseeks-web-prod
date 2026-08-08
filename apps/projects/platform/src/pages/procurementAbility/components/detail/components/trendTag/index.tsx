import React from 'react'
import { CaretDownOutlined } from '@ant-design/icons'

import styles from './index.less'

interface TrendTagProps {
  ratio?: any
}

const TrendTag: React.FC<TrendTagProps> = (props: any) => {
  const { ratio } = props
  if (ratio < 0) {
    return (
      <div className={styles.trendTag}>
        <CaretDownOutlined style={{ color: '#E63F3B', fontSize: '10px', marginRight: '2px' }} />
        {Math.abs(ratio)}%
      </div>
    )
  } else {
    return null
  }
}

export default TrendTag
