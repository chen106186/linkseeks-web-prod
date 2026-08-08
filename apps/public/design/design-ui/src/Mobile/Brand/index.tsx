import React from 'react'
import cx from 'classnames'
import Header from './Header'
import List from './List'
import styles from './styles.less'

interface MobileBrandProps {
  className?: string
  /** 显示状态 true: 显示，false: 隐藏 */
  visible?: boolean
}
interface ItemProps {
  Header: typeof Header
  List: typeof List
}

const MobileBrand: React.FC<MobileBrandProps> & ItemProps = (props) => {
  const { className, visible, children, ...others } = props

  return visible ? (
    <div className={cx(styles['lingxi-brand'], className)} {...others}>
      {children}
    </div>
  ) : null
}

MobileBrand.Header = Header
MobileBrand.List = List

MobileBrand.defaultProps = {
  visible: true,
}

export default MobileBrand
