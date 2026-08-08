import React from 'react'
import styles from './index.less'

interface FormRequireItemProps {
  label: string
  required?: boolean
  labelStyle?: React.CSSProperties
}

const FormLabel: React.FC<FormRequireItemProps> = (props) => {
  const { label, required, labelStyle } = props

  return (
    <div className={styles.require_item_wrap}>
      <label className={styles.require_item_label} style={labelStyle}>
        {label}
      </label>
      {required && <i className={styles.require_item_mark}>*</i>}
    </div>
  )
}

FormLabel.defaultProps = {
  required: false,
  labelStyle: {},
}

export default FormLabel
