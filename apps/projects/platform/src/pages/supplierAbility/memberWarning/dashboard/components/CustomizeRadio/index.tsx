import React, { useState } from 'react'
import styles from './index.less'
import cx from 'classnames'

export type Options = {
  label: string
  value: string | number
} & {
  [key: string]: any
}

interface Iprops {
  options: Options[]
  value?: string | number
  onChange?: ((_item: Options) => void) | null
}

const CustomizeRadio: React.FC<Iprops> = (props: Iprops) => {
  const { options, value, onChange } = props
  const [activeKey, setActiveKey] = useState<Options['value']>(null)

  const handleCheck = (_item: Options) => {
    console.log(_item)
    if (!('value' in props)) {
      setActiveKey(_item.value)
    }
    onChange?.(_item)
  }

  return (
    <div className={styles.container}>
      {options.map((_item) => {
        const _itemClassName = cx(styles.item, {
          [styles.active]: activeKey === _item.value,
        })
        return (
          <div className={_itemClassName} key={_item.value} onClick={() => handleCheck(_item)}>
            {`${_item.label}(${_item.count})`}
          </div>
        )
      })}
    </div>
  )
}

export default CustomizeRadio
