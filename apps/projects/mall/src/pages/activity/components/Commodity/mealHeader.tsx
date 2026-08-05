import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import styles from './mealHeader.module.less'

interface Iprops {
  title: string
  subContent: string
  mainColor?: string
  onClick?: () => void
}

const MealHeader: React.FC<Iprops> = (props) => {
  const { title, subContent, mainColor, onClick } = props
  const translate = getWebIntl()

  const handClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className={styles.meal_header}>
      <div className={styles.title}>
        {title}
        <span className={styles.sub_content}>{subContent}</span>
      </div>
      <div className={cx(styles.button)} style={mainColor ? { backgroundColor: mainColor } : {}} onClick={handClick}>
        <span>{translate('web.resource.mall.lijigoumai')}</span>
      </div>
    </div>
  )
}

export default MealHeader
