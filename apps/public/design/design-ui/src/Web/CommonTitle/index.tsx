import React, { Fragment } from 'react'
import styles from './index.less'

interface CommonTitlePropsType {
  title: string
  type?: 'normal' | 'primary'
}

const CommonTitle: React.FC<CommonTitlePropsType> = (props) => {
  const { title = '', type = 'normal' } = props

  const renderTitle = () => {
    switch (type) {
      case 'normal':
        return <span>{title}</span>
      case 'primary':
        const text1 = title.substring(0, 2)
        const text2 = title.substring(2, 4)
        return (
          <Fragment>
            <span>{text1}</span>
            <span className={styles.primary}>{text2}</span>
          </Fragment>
        )
    }
  }

  return (
    <div className={styles.channel_floor_title}>
      <div className={styles.channel_floor_container}>
        <div className={styles.channel_floor_title_split}></div>
        <div className={styles.channel_floor_title_text}>{renderTitle()}</div>
        <div className={styles.channel_floor_title_split}></div>
      </div>
    </div>
  )
}

export default CommonTitle
