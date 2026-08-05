// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.module.less'

interface InputNumberPropsType {
  value: number
  onChange: Function
  min?: number
  max?: number
  disabled?: boolean
}

const InputNumber: React.FC<InputNumberPropsType> = (props) => {
  const { value, onChange, min, max, disabled = false } = props
  const [minCount, setMinCount] = useState<number>(1)
  const [maxCount, setMaxCount] = useState<number>(0)

  useEffect(() => {
    if (min || min === 0) {
      setMinCount(min)
      if (value < min) {
        onChange(min, 'blur')
      }
    }
    if (max || max === 0) {
      setMaxCount(max)
      if (value > max) {
        onChange(max, 'blur')
      }
    }
  }, [min, max])

  const handleReduce = (e: any) => {
    e.stopPropagation()
    if (value > minCount) {
      onChange(accSub(value, 1), 'click')
    }
  }

  const handleAdd = (e: any) => {
    e.stopPropagation()
    if (value < maxCount) {
      onChange(accAdd(value, 1), 'click')
    }
  }

  const accAdd = (num1: number, num2: number) => {
    // tslint:disable-next-line:one-variable-per-declaration
    let r1, r2
    try {
      r1 = num1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = num2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2))
    return Math.round(num1 * m + num2 * m) / m
  }

  const accSub = (num1: number, num2: number) => {
    // tslint:disable-next-line:one-variable-per-declaration
    let r1, r2
    try {
      r1 = num1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = num2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2))
    const n = r1 >= r2 ? r1 : r2
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
  }

  const handleChange = (e: any) => {
    const { value } = e.target
    const reg = /^\d*([.]?\d{0,3})$/
    if (reg.test(String(value))) {
      onChange(value, 'change')
    }
  }

  const handleBlur = (e: any) => {
    const { value } = e.target
    let num: string = value
    const reg = /^\d*(.$)/
    if (reg.test(num)) {
      num = value.replace('.', '')
    }

    if (num === '') {
      onChange(minCount, 'blur')
    } else {
      if (Number(num) < minCount) {
        onChange(minCount, 'blur')
      } else if (Number(num) > maxCount) {
        onChange(maxCount, 'blur')
      } else {
        onChange(num, 'blur')
      }
    }
  }

  return (
    <div className={styles.input_number}>
      <div
        className={cx(styles.input_number_item, styles.reduce, value <= minCount ? styles.disable : '')}
        onClick={handleReduce}
      >
        <MinusOutlined translate={undefined} />
      </div>
      <input
        disabled={disabled}
        maxLength={12}
        className={styles.input_number_input}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div
        className={cx(styles.input_number_item, styles.add, value >= maxCount ? styles.disable : '')}
        onClick={handleAdd}
      >
        <PlusOutlined translate={undefined} />
      </div>
    </div>
  )
}

export default InputNumber
