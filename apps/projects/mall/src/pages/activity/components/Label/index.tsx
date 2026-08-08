import React from 'react'
import classNames from 'classnames'
import styles from './index.module.less'

export type TypeName = 'primary' | 'success' | 'danger' | 'purple' | 'warning' | 'default'

interface Iprops {
  type?: TypeName
  mode?: 'inner' | 'ghost'
  name: string
}

const Label: React.FC<Iprops> = (props: Iprops) => {
  const { type = 'default', mode = 'ghost', name } = props
  return (
    <div className={classNames(styles.label)}>
      <div className={styles[`label-${mode}-${type}`]}>{name}</div>
    </div>
  )
}

export default Label
