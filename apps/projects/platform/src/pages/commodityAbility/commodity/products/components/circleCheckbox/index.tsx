import React, { useState, useEffect, ReactNode } from 'react'
import cx from 'classnames'
import styles from './index.less'

interface PriceInputProps {
  value?: number[]
  onChange?: (value: number[]) => void
  options: any
  expandOperation?: ReactNode
  disabled?: boolean
}

/**
 * 新增商品 方形多选表单
 * @returns
 */

const CircleCheckbox: React.FC<PriceInputProps> = ({
  value = [],
  options = [],
  onChange,
  expandOperation = null,
  disabled = false,
}) => {
  const [currentValue, setCurrentValue] = useState<number[]>([...value])

  useEffect(() => {
    onChange?.([...currentValue])
  }, [currentValue])

  const clickItem = (id) => {
    const _value = [...currentValue]
    if (_value.includes(id)) {
      var index = _value.indexOf(id)
      if (index > -1) {
        _value.splice(index, 1)
      }
      setCurrentValue([..._value])
    } else {
      _value.push(id)
      setCurrentValue([..._value])
    }
  }

  return options.length ? (
    <div className={styles.circleCheckbox}>
      <ul className={styles.circleCheckboxUl}>
        {options.map((item: any, index: string) => (
          <li
            key={item.id}
            // className={currentValue.includes(item.id) ? cx(styles.active, styles.circleCheckboxUlLi) : styles.circleCheckboxUlLi}
            className={cx(
              currentValue.includes(item.id) ? cx(styles.active, styles.circleCheckboxUlLi) : styles.circleCheckboxUlLi,
              disabled ? styles.isDisabled : null,
            )}
            onClick={() => clickItem(item.id)}
          >
            <span>{item.value}</span>
          </li>
        ))}
        {expandOperation}
      </ul>
    </div>
  ) : null
}

export default CircleCheckbox
