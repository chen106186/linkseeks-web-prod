import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
interface YearBoxProps {
  year: number
  style?: React.CSSProperties
}

const YearBox: React.FC<YearBoxProps> = (props) => {
  const { year, style } = props
  const intl = useIntl()

  return (
    <div className={styles.yearbox} style={style ? style : {}}>
      <span>
        {intl.formatMessage({ id: 'components.ruzhu' })}
        {year}
        {intl.formatMessage({ id: 'components.nian' })}
      </span>
    </div>
  )
}

export default YearBox
