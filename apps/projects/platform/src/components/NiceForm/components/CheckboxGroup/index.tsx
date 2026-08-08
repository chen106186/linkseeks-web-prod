import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = (props: any) => {
  const { value, schema, form, path, mutators, editable } = props;
  const { placeholder, dataSource = [], ...rest } = props.props["x-component-props"] || {};
  return (
    <Checkbox.Group
      disabled={!editable}
      options={dataSource}
      defaultValue={value}
      onChange={e => mutators.change(e)}
      {...rest} />
  );
}

CheckboxGroup.isFieldComponent = true;


export default CheckboxGroup;
