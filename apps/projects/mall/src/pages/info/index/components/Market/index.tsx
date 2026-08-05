import React from 'react'
import MarketLeft from './MarketLeft'
import MarketRight from './MarketRight'
import styles from './index.module.less'

const Market: React.FC = () => {
  return (
    <div className={styles['market-main']}>
      <MarketLeft />
      <MarketRight />
    </div>
  )
}

export default Market
