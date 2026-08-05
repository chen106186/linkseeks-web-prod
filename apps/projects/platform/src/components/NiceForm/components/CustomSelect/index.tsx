import React, { useState, useEffect } from 'react';
import { Select, Row, Col } from 'antd';
const { Option } = Select;

const CustomSelect = (props: any) => {
    const { value, schema, form, path, mutators, editable } = props;
    const { placeholder, dataSource = [], ...rest } = props.props["x-component-props"] || {};
    return (
        <Select
            value={value || undefined}
            placeholder={placeholder}
            onChange={e => { mutators.change(e) }}
            disabled={!editable}
            options={dataSource}
            {...rest}
        />
    )
}

CustomSelect.isFieldComponent = true;


export default CustomSelect;