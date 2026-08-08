import React from 'react'
import { Skeleton } from 'antd'
import styles from './index.module.less'

const SkeletonCard = (props) => {
  const skeletonList = [1, 2, 3, 4]
  return (
    <ul className={styles['skeleton-main']}>
      {skeletonList.map((key: number) => {
        return (
          <li className={styles['skeleton-warp']} key={key + 'skeletoncard'}>
            <Skeleton paragraph={{ rows: 8 }} key={key} active />
          </li>
        )
      })}
    </ul>
  )
}

export default SkeletonCard
