import React from 'react'
import styles from './index.less'
import type { SkeletonProps } from 'antd/es/skeleton'
import { Skeleton } from 'antd'

export type PreLoadingProps = SkeletonProps

const PreLoading: React.FC<PreLoadingProps> = (props) => {
  const { children, loading, ...restProps } = props
  return loading ? (
    <div className={styles.preWrapper}>
      <Skeleton {...restProps} />
    </div>
  ) : (
    <>{children}</>
  )
}

PreLoading.defaultProps = {}

export default PreLoading
