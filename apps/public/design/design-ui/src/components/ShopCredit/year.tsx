import React from 'react'
import styles from './index.less'

interface YearBoxProps {
  year: number
  style?: React.CSSProperties
}

const YearBox: React.FC<YearBoxProps> = (props) => {
  const { year, style } = props

  return (
    <div className={styles.yearbox} style={style ? style : {}}>
      <span>入驻{year}年</span>
    </div>
  )
}

export default YearBox
