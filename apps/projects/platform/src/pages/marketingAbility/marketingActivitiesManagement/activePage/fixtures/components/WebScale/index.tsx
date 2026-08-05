import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import React from 'react'
import styles from './index.less'

const Option = Select.Option

const list = [
  { label: '10%', value: 0.1 },
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '60%', value: 0.6 },
  { label: '70%', value: 0.7 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
] as const

export type ScaleValueType = (typeof list)[number]['value']

type ScaleOptions = {
  label: string
  value: ScaleValueType
}

interface Iprops {
  scaleValue: ScaleValueType
  onChange: (value: number) => void
}

const WebScale: React.FC<Iprops> = (props: Iprops) => {
  const { scaleValue, onChange } = props

  const handleScale = (type: 'large' | 'small') => {
    const index = list.findIndex((_item) => _item.value === scaleValue)
    if (index === 0 && type === 'small') {
      return
    }
    if (index === list.length - 1 && type === 'large') {
      return
    }
    let prevOrLast = type === 'small' ? index - 1 : index + 1
    onChange?.(list[prevOrLast].value)
  }

  const handleSelectChange = (value: ScaleValueType) => {
    onChange?.(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.icon} onClick={() => handleScale('small')}>
        <MinusOutlined />
      </div>
      <div className={styles.select}>
        <Select onChange={handleSelectChange} style={{ width: '100%' }} showArrow={false} value={scaleValue}>
          {list.map((_item) => {
            return (
              <Option key={_item.value} value={_item.value}>
                {_item.label}
              </Option>
            )
          })}
        </Select>
      </div>
      <div className={styles.icon} onClick={() => handleScale('large')}>
        <PlusOutlined />
      </div>
    </div>
  )
}

export default WebScale
