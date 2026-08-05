import React, { useEffect, useState } from 'react'
import styles from './index.less';
import cs from 'classnames';

export type Options = {
  label: string,
  value: number | string,
}

interface Iprops {
  options: Options[],
  value?: number | string,
  // defaultValue?: number | string,
  disabled?: boolean,
  onChange?: null | ((value: number | string) => void),
}

const CustomizeRadioButton: React.FC<Iprops> = (props: Iprops) => {
  const { options, value, onChange, disabled } = props;
  const [innerValue, setInnerValue] = useState(() => value || '');
  useEffect(() => {
    if ("value" in props && typeof value !== 'undefined') {
      setInnerValue(value);
    }
  }, [value])

  const handleChange = (value: number | string) => {
    if (disabled) {
      return
    }
    if (!("value" in props)) {
      setInnerValue(value);
    }
    if(onChange) {
      onChange(value)
    }
  }
  return (
    <div className={styles.container}>
      {
        options.map((_item) => {
          return (
            <div
              key={_item.value}
              className={cs(styles.item, { [styles.activeItem]: _item.value === innerValue })}
              onClick={() => handleChange(_item.value)}
            >
              {_item.label}
            </div>
          )
        })
      }
    </div>
  )
}

CustomizeRadioButton.defaultProps = {
  onChange: null,
  // defaultValue: '',
  disabled: false,
}

export default CustomizeRadioButton
