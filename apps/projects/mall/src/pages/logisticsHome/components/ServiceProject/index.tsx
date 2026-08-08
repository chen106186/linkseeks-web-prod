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
      case '服务多样':
        return <IconFont type="icon-services" />
      case '安全可靠':
        return <IconFont type="icon-safe" />
      case '运输监控':
        return <IconFont type="icon-monitoring" />
      case '货损理赔':
        return <IconFont type="icon-cargo" />
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
