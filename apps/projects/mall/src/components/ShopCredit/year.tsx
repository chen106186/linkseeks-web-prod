import React from 'react'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface YearBoxProps {
  year: number
  style?: React.CSSProperties
}

const YearBox: React.FC<YearBoxProps> = (props) => {
  const { year, style } = props
  const translate = getWebIntl()

  return (
    <div className={styles.yearbox} style={style ? style : {}}>
      <span>{translate('web.resource.mall.ruzhunian', { year })}</span>
    </div>
  )
}

export default YearBox
