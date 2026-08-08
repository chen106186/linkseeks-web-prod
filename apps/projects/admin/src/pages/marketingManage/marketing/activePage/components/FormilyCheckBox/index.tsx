import React from 'react'
import { Checkbox } from 'antd'
import styles from './index.less'

type CheckboxType = {
  label: string
  value: number | string
  extra?: number | string
}

type XcomponentProps = {
  /** 是否是单选按钮 */
  isRadio: boolean
}

interface Iprops {
  props: {
    enum: CheckboxType[]
    'x-component-props': XcomponentProps
  }
  mutators: {
    change: (params: number[] | string[]) => void
  }
  value: number[] | string[]
}

const FormilyCheckBox: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value = [], mutators } = props
  const componentProps = props.props || {}
  const xComponentProps = componentProps['x-component-props'] || ({} as XcomponentProps)
  const isRadio = xComponentProps?.isRadio || false
  const enumsMap: CheckboxType[] = componentProps?.enum || []

  const handleChange = (isChecked: boolean, _item: CheckboxType) => {
    let newList: string[] | number[] = []
    console.log(isChecked)
    if (isRadio) {
      if (isChecked) {
        newList = [_item.value as string]
      }
      mutators.change(newList)
      return
    }

    if (isChecked) {
      newList = (value as string[]).concat(_item.value as string)
    } else {
      newList = (value as string[]).filter((_row) => _row !== _item.value)
    }
    mutators.change(newList)
  }

  return (
    <div className={styles.container}>
      {enumsMap.map((_item) => {
        const isChecked = (value as string[]).indexOf((_item as any).value) !== -1
        return (
          <div className={styles.checkboxItem} key={_item.value}>
            <Checkbox checked={isChecked} onChange={(e) => handleChange(e.target.checked, _item)}>
              <div className={styles.checkbox}>
                <span>{_item.label}</span>
              </div>
            </Checkbox>
          </div>
        )
      })}
    </div>
  )
}

FormilyCheckBox.isFieldComponent = true

export default FormilyCheckBox
