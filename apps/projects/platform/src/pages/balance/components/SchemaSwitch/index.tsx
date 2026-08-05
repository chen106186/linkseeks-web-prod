/*
 * @Author: your name
 * @Date: 2020-10-20 16:25:45
 * @Description: switch 组件
 */

import React from 'react';
import { Switch } from 'antd';

const SchemaSwitch = (props) => {
  const editable = props.editable;
  const handleChange = (checked) => {
    props.mutators.change(checked)
  }

  return (
    <Switch disabled={!editable} checked={props.value} onChange={handleChange} />
  )
}

SchemaSwitch.isFieldComponent = true;

export default SchemaSwitch