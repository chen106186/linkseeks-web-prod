import React from 'react'
import styles from './chart.less'

const colors = ['#1fbf87', '#4b8bfa', '#5d7092', '#f7a12b', '#e05a55', '#fff', '#000']

interface Iprops {
  data: number[]
  title: string
}

const PercentChart: React.FC<Iprops> = (props: Iprops) => {
  const { data, title } = props
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <div className={styles.percent}>
        {data.map((_item, index) => {
          return (
            (_item !== 0 && (
              <div
                key={_item}
                className={styles.percentItem}
                style={{ flex: _item, background: colors[index] }}
              >{`${_item}%`}</div>
            )) ||
            null
          )
        })}
      </div>
    </div>
  )
}

export default PercentChart
