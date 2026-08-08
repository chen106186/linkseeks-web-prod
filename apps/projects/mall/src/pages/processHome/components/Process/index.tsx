import React from 'react'
import IconFont from '@/utils/iconfont'
import styles from './index.module.less'

const Process: React.FC = () => {
  return (
    <ul className={styles['process-main']}>
      <li className={styles['process-item-warp']}>
        <div className={styles['process-item']}>
          <IconFont type="icon-registered" />
        </div>
        <div className={styles['process-tips']}>注册会员</div>
      </li>
      <li className={styles['process-item-warp']}>
        <div className={styles['process-item']}>
          <IconFont type="icon-application" />
        </div>
        <div className={styles['process-tips']}>提交申请</div>
      </li>
      <li className={styles['process-item-warp']}>
        <div className={styles['process-item']}>
          <IconFont type="icon-examination" />
        </div>
        <div className={styles['process-tips']}>资质审核</div>
      </li>
      <li className={styles['process-item-warp']}>
        <div className={styles['process-item']}>
          <IconFont type="icon-free" />
        </div>
        <div className={styles['process-tips']}>免费开通</div>
      </li>
    </ul>
  )
}

export default Process
