import React, { useState } from 'react'
import cx from 'classnames'
import { Input } from 'antd'
import styles from './index.module.less'

interface PasswordInputPropsType {
  onChange: Function
  type?: string
  value: string
  className?: string
  maxLength?: number
}

const PasswordInput: React.FC<PasswordInputPropsType> = (props) => {
  const [focus, setFocus] = useState<boolean>(false)
  const { value = '', onChange, type = 'password', maxLength = 6, className = '' } = props
  const splitValueFormNum = (num: number) => {
    return value.substring(num - 1, num)
  }

  const handleChange = (e: any) => {
    const reg = /^\d*?$/
    if (reg.test(e.target.value)) {
      onChange(e.target.value)
    }
  }

  const inputList: number[] = []
  for (let i = 0; i < maxLength; i++) {
    inputList.push(i)
  }

  return (
    <div className={cx(styles['password-input'], className)}>
      <div className={styles['password-input-body']}>
        <div className={styles['password-input-list']}>
          {inputList.map((item) => (
            <div className={cx(styles['password-input-item'], value.length === item && focus ? styles.flash : '')}>
              {type === 'password' ? (
                value.length > item && <div className={styles.circle}></div>
              ) : value.length > item ? (
                <span>{splitValueFormNum(item + 1)}</span>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
        <Input
          className={styles['password-input-box']}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
    </div>
  )
}

export default PasswordInput
