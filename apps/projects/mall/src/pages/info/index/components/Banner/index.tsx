import React from 'react'
import BannerLeft from './BannerLeft'
import BannerContent from './BannerContent'
import styles from './index.module.less'

const Banner: React.FC = () => {
  return (
    <div className={styles['banner-warp']}>
      <BannerLeft />
      <BannerContent />
    </div>
  )
}

export default Banner
