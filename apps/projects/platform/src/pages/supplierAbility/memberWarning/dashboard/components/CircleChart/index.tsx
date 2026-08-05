import React from 'react'
import CustomizeCard from '../CustomizeCard'
import CommonDonutChart from '../DonutChart'
import StatusLabel from '../StatusLabel'
import styles from './index.less'
import cx from 'classnames'

interface Iprops {
  title: string
  options: {
    label: string
    render: () => React.ReactNode
  }[]
}

const CircleChart: React.FC<Iprops> = (props: Iprops) => {
  const { title, options } = props
  return (
    <CustomizeCard title={title} bodyStyle={{ height: '312px', padding: '0' }}>
      <div className={styles.container}>
        <div className={styles.sectionItem}>
          <CommonDonutChart />
        </div>
        <div className={cx(styles.sectionItem, styles.labelSection)}>
          <StatusLabel direction={'column'} options={options} type="circle" />
        </div>
      </div>
    </CustomizeCard>
  )
}

export default CircleChart
