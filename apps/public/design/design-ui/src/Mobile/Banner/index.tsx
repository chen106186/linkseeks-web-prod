import React from 'react'
import { Carousel } from 'antd'
import cx from 'classnames'

import Items from './Items'

import styles from './index.less'

interface BannerProps {
  children?: React.ReactNode[]
  className?: string
  /** 显示状态 true: 显示，false: 隐藏 */
  visible?: boolean
}

type ItemProps = {
  Items: typeof Items
}

const Banner: React.FC<BannerProps> & ItemProps = (props: BannerProps) => {
  const { children, className, visible, ...other } = props

  return visible ? (
    <div className={cx(styles['lingxi-banner'], className)} {...other}>
      <Carousel autoplay={true} dots={false}>
        {children}
      </Carousel>
    </div>
  ) : null
}

Banner.Items = Items

Banner.defaultProps = {
  status: true,
}

export default Banner
