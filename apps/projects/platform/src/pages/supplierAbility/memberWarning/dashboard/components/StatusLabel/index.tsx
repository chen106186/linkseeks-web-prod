import React from 'react'
import styles from './index.less'
import cx from 'classnames'

type Options = {
  label: string
  color?: string | null
  render?: () => React.ReactNode
}

interface Iprops {
  direction?: 'row' | 'column'
  type?: 'circle' | 'square'
  options: Options[]
}

const colors = ['#1fbf87', '#4b8bfa', '#5d7092', '#f7a12b', '#e05a55', '#000', '#000']

const StatusLabel: React.FC<Iprops> & { Item: typeof Item } = (props: Iprops) => {
  const { direction, type, options } = props
  const containerCx = cx(styles.container, styles[direction])
  return (
    <div className={containerCx}>
      {options.map((_item, index) => {
        return (
          <div className={cx(styles.item, { [styles.last]: index + 1 === options.length })} key={index}>
            <div
              className={cx(styles[type])}
              style={_item.color ? { background: _item.color } : { background: colors[index] || '#fff' }}
            ></div>
            <div>{_item.render?.() || _item.label}</div>
          </div>
        )
      })}
    </div>
  )
}

interface ItemProps {
  percent: string
  range: string
  value: number
}

const Item: React.FC<ItemProps> = (props: ItemProps) => {
  return (
    <div className={styles.renderItem}>
      <span className={styles.range}>{props.range}</span>
      <div className={styles.dataInfo}>
        <span className={styles.percent}>{props.percent}</span>
        <span className={styles.count}>{props.value}</span>
      </div>
    </div>
  )
}

StatusLabel.Item = Item

StatusLabel.defaultProps = {
  direction: 'row',
  type: 'square',
}

export default StatusLabel
