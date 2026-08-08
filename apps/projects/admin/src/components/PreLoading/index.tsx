import React from 'react'
import styles from './index.less'
import { SkeletonProps } from 'antd/es/skeleton'
import { Skeleton } from 'antd'

export interface PreLoadingProps extends SkeletonProps {}

const PreLoading: React.FC<PreLoadingProps> = (props) => {
  const { children, loading, ...restProps } = props
  return loading ? (
    <div className={styles.preWrapper}>
      <Skeleton {...restProps}></Skeleton>
    </div>
  ) : (
    <>{children}</>
  )
}

PreLoading.defaultProps = {}

export default PreLoading
