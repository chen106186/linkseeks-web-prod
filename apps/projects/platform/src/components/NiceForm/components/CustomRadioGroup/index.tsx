import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';

const CustomRadioGroup = (props: any, state: any) => {
  const { value, schema, form, path, mutators, editable } = props;
  const { placeholder, dataSource = [], layout, ...rest } = props.props["x-component-props"] || {};
  return (
    <Radio.Group
      className={layout === 'column' ? 'identityRadio' : ''}
      optionType={layout === 'column' ? 'button' : 'default'}
      disabled={!editable}
      options={dataSource}
      onChange={e => { mutators.change(e.target.value) }}
      value={value || undefined}
      {...rest} />
  );
}

CustomRadioGroup.isFieldComponent = true;

export default CustomRadioGroup;
