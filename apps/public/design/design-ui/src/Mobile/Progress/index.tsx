import React from 'react'
import styles from './index.less'

/**
 * 进度条，
 * @ui地址 https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/2kY5j3nrYEZExNd/screen-list
 */

interface Iprops {
  color: string
  /** 未完成分带颜色 */
  trailColor: string
  /** 浸提条提示 */
  progressTips?: string
  /** 百分比 */
  percent?: number
  /** 是否显示右侧文字 */
  extra: React.ReactNode
}

const Progress: React.FC<Iprops> = (props: Iprops) => {
  const { progressTips, percent, extra, color, trailColor } = props
  const prefix = 'lingxi'

  return (
    <div className={styles[`${prefix}-progress-container`]}>
      <div
        className={styles[`${prefix}-progress`]}
        style={{ background: `${trailColor}` }}
      >
        <div
          className={styles[`${prefix}-progress-percent`]}
          style={{ width: `${percent}%`, background: `${color}` }}
        />
        <span className={styles[`${prefix}-progress-percent-text`]}>
          {progressTips}
        </span>
      </div>
      {extra}
    </div>
  )
}

Progress.defaultProps = {
  trailColor: '#FFF0F2',
  color: '#ef3346',
  percent: 0,
  extra: null,
}

export default Progress
