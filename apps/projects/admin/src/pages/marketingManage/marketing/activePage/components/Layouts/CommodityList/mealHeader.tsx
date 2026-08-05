import React from 'react'
import cx from 'classnames'
import styles from './mealHeader.less'

interface Iprops {
  title: string
  subContent: string
  mainColor?: string
}

const MealHeader: React.FC<Iprops> = (props) => {
  const { title, subContent, mainColor } = props

  return (
    <div className={styles.meal_header}>
      <div className={styles.title}>
        {title}
        <span className={styles.sub_content}>{subContent}</span>
      </div>
      <div className={cx(styles.button)} style={mainColor ? { backgroundColor: mainColor } : {}}>
        <span>立即购买</span>
      </div>
    </div>
  )
}

export default MealHeader
