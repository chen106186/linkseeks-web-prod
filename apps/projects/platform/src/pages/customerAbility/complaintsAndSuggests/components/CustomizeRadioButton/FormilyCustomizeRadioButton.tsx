import React, { useEffect } from 'react';
import CustomizeRadioButton from '.';
import { Options } from '.';

interface Iprops {
  editable: boolean,
  value: Options["value"],
  mutators: {
    change: (value: Options["value"]) => void
  },
  props: {
    enum: Options[],
  }
  errors: string[]
}

const FormilyCustomizeRadioButton: React.FC<Iprops> & { isFieldComponent: boolean } = (_props: Iprops) => {
  const {  value, editable, props, mutators, errors } = _props;
  const enumData = props.enum;
  const componentProps = props?.['x-component-props'] || {};

  const handleChange = (data: string | number) => {
    mutators.change?.(data);
  }

  return (
    <div>
      <CustomizeRadioButton
        disabled={!editable}
        options={enumData}
        value={value}
        onChange={handleChange}
        {...componentProps}
      />
      {
        errors.length > 0 && (
          <p style={{color: '#ff4d4f'}}>{errors.join("")}</p>
        )
      }
    </div>
  )
}

FormilyCustomizeRadioButton.isFieldComponent = true

export default FormilyCustomizeRadioButton
