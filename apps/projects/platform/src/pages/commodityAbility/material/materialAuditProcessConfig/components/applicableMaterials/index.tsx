import { Radio } from 'antd'
import React from 'react'
import styles from './index.less'
import className from 'classnames'

type EnumType = {
  title: string
  id: string | number
}

interface Iprops {
  props: {
    enum: EnumType[]
  }
  value: EnumType
  editable: boolean
  mutators: {
    change: (id: number | string) => void
  }
}

const ApplicableMaterial: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, editable, mutators } = props
  const options = props.props?.enum || []

  const handleChange = (_item: EnumType) => {
    if (!editable) {
      return
    }
    mutators.change(_item.id)
  }

  return (
    <div className={styles.container}>
      {options.map((_item) => {
        const isChecked = _item.id === +value
        return (
          <div
            key={_item.id}
            className={className(styles.item, { [styles.active]: isChecked })}
            onClick={() => handleChange(_item)}
          >
            <Radio checked={isChecked} />
            {_item.title}
          </div>
        )
      })}
    </div>
  )
}

ApplicableMaterial.isFieldComponent = true

export default ApplicableMaterial
