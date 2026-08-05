import React from 'react'
import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.less'

interface ShowCaseItemProps {
  className: string
  // 名称
  name?: string
  // 类型
  type: number
  // 广告图
  banner: string
  // 内页广告图
  inner?: string
  // 是否显示
  visible?: boolean
}

const ShowCaseItem: React.FC<ShowCaseItemProps> = (props) => {
  const { children, className, banner, visible = true, ...other } = props

  const classNameString = cx(styles['lingxi-mobile-show-case-item'], className)

  if (!visible) return null

  return banner ? (
    <div className={classNameString} {...other}>
      <div className={styles['lingxi-mobile-show-case-item-body']}>
        <ImageBox
          className={styles['banner']}
          src={banner}
          width="100%"
          height={120}
          wrapperStyle={{ width: '100%' }}
          resizeMode="cover"
        />
      </div>
    </div>
  ) : (
    <div className={classNameString} {...other}>
      <div className={styles['lingxi-mobile-show-case-item-body']}>
        <PlusOutlined style={{ color: '#CBCACD' }} />
      </div>
    </div>
  )
}

export default ShowCaseItem
