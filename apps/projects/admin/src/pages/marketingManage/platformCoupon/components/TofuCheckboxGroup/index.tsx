/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 10:14:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 11:01:39
 * @Description: 豆腐方块复选框
 */
import React, { useState, useEffect } from 'react'
import { Checkbox } from 'antd'
import classNames from 'classnames'
import styles from './index.less'

export type OptionItemType = {
  /**
   * label
   */
  label: string
  /**
   * 名称
   */
  value: number
  /**
   * 是否禁用
   */
  disabled: boolean
}

export type ValueType = any[]

export type TofuCheckboxGroupProps = {
  /**
   * 选项
   */
  options: OptionItemType[]
  /**
   * 值
   */
  value?: any[]
  /**
   * 默认值
   */
  defaultValue?: any[]
  /**
   * 选项改变触发事件
   */
  onChange?: (value: ValueType) => void
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否可编辑的
   */
  editable?: boolean
}

const TofuCheckboxGroup: React.FC<TofuCheckboxGroupProps> = (props) => {
  const { options = [], value: outerValue, defaultValue = [], onChange, disabled = false, editable = true } = props
  const initValue = 'value' in props ? outerValue : defaultValue
  const [value, setValue] = useState<ValueType>(initValue)

  useEffect(() => {
    if ('value' in props) {
      setValue(props.value)
    }
  }, [props.value])

  const handleChange = (val: ValueType) => {
    if (!('value' in props)) {
      setValue(val)
    }
    if (onChange) {
      onChange(val)
    }
  }

  return (
    <div className={styles['tofuCheckbox-list']}>
      <Checkbox.Group
        value={value}
        onChange={handleChange}
        className={styles['tofuCheckbox-list-checkboxGroup']}
        disabled={disabled}
      >
        {options.map((item) => {
          const itemCls = classNames(styles['tofuCheckbox-list-item'], {
            [styles['tofuCheckbox-list-item-checked']]: Array.isArray(value) && value.includes(item.value),
            [styles['tofuCheckbox-list-item-disabled']]: (item.disabled || disabled) && editable,
          })
          return (
            <div key={item.value} className={itemCls}>
              <div className={styles['tofuCheckbox-list-item-title']}>{item.label}</div>
              <Checkbox
                value={item.value}
                className={styles['tofuCheckbox-list-item-checkbox']}
                disabled={item.disabled || disabled}
              />
            </div>
          )
        })}
      </Checkbox.Group>
    </div>
  )
}

export default TofuCheckboxGroup
