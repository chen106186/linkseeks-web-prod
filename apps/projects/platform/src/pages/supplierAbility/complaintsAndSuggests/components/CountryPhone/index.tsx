import React, { useCallback, useEffect, useState } from 'react'
import { Select, Input } from 'antd'
import styles from './index.less'

export type OptionsType = {
  label: string
  value: string | number
  countryIcon?: null | string
}

export type ValueType = {
  code: string
  phone: string
}

interface Iprops {
  countryOptions: OptionsType[]
  value?: ValueType
  disable?: boolean
  onChange?: (value: ValueType) => void
}

const Option = Select.Option

const CountryPhone: React.FC<Iprops> = (props: Iprops) => {
  const [innerValue, setInnerValue] = useState<ValueType>({
    code: '',
    phone: '',
  })
  const { countryOptions, value, onChange, disable } = props

  useEffect(() => {
    if ('value' in props && 'code' in props.value) {
      setInnerValue(value)
    }
  }, [value])

  const handleChange = (name: 'code' | 'phone', data: string) => {
    const newData = {
      ...innerValue,
      [name]: data,
    }
    if (!('value' in props)) {
      setInnerValue(() => newData)
    }
    onChange?.(newData)
  }

  return (
    <div className={styles.container}>
      <Select
        disabled={disable}
        value={innerValue.code}
        className={styles.select}
        onChange={(selectValue) => handleChange('code', selectValue.toString())}
      >
        {countryOptions?.map((_item: OptionsType) => {
          return (
            <Option key={_item.value} value={_item.value}>
              <div>
                {_item.countryIcon && <img className={styles.image} src={_item.countryIcon} />}
                {`${_item.value} ${_item.label}`}
              </div>
            </Option>
          )
        })}
      </Select>
      <Input
        disabled={disable}
        className={styles.input}
        value={innerValue.phone}
        onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange('phone', e.currentTarget.value)}
      />
    </div>
  )
}

CountryPhone.defaultProps = {
  onChange: null,
  disable: false,
}

export default CountryPhone
