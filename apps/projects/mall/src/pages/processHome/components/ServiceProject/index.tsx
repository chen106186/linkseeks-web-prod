import React from 'react'
import IconFont from '@/utils/iconfont'
import styles from './index.module.less'

interface Props {
  serviceTitle?: string
  serviceScondTitle?: string
  serviceScondTitleT?: string
}

const ServiceProject: React.FC<Props> = (props) => {
  const {
    serviceTitle = '服务多样',
    serviceScondTitle = '汽运、水运、水陆联运、',
    serviceScondTitleT = '专线运输、小吨位拼车、多装多卸配送。',
  } = props

  const fnGetIcon = (key: string) => {
    switch (key) {
      case '加工方案优选':
        return <IconFont type="icon-optimization" />
      case '专人全程跟单':
        return <IconFont type="icon-documentary" />
      case '费用结算便捷':
        return <IconFont type="icon-settlement" />
      case '加工质量保障':
        return <IconFont type="icon-guarantee" />
    }
  }

  return (
    <div className={styles['service-warp']}>
      <div className={styles['service-icon-warp']}>{fnGetIcon(serviceTitle)}</div>
      <div className={styles['service-title']}>{serviceTitle}</div>
      <div className={styles['service-title-second']}>{serviceScondTitle}</div>
      <div className={styles['service-title-second']}>{serviceScondTitleT}</div>
    </div>
  )
}

export default ServiceProject
