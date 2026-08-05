import React from 'react'
import cx from 'classnames'
import styles from './index.less'

export interface InformationListProps {
  className: string
  activeType: number
}

/**
 * 分类标签-资讯列表
 * @param props
 * @returns
 */
const InformationList: React.FC<InformationListProps> = (props) => {
  const { activeType, className, ...others } = props

  const classNameString = cx(styles['information-list'], className)

  return activeType === 4 ? (
    <div className={classNameString} {...others}>
      InformationList
    </div>
  ) : null
}

export default InformationList
