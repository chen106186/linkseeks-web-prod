import React from 'react';
import { Row, Col, Select, Input } from 'antd';
import styled from 'styled-components';
import { findItemAndDelete } from '@/utils';
import cx from 'classnames';

const { Option } = Select;

const RowStyleLayout = styled(props => <div {...props} />)``;

const registryPhone = (props: any) => {
  const { dataSource = [], selectPh, inputPh } = props.props[
    'x-component-props'
  ];
  const defaultValue: any = props.props.default || {};
  const value: any = props.value || {};

  const handleChange = (type, e) => {
    if (type === 'select') {
      props.mutators.change({ ...value, phone: e });
    } else {
      e.persist();
      props.mutators.change({ ...value, countryCode: e.target.value });
    }
  };

  return (
    <Row>
      <Col span={8}>
        <Select
          value={defaultValue.countryCode}
          onChange={val => handleChange('select', val)}
          placeholder={selectPh}
        >
          {dataSource.map((v, i) => {
            return (
              <Option key={v.text} value={v.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    style={{
                      width: '24px',
                      height: '17px',
                      marginRight: '8px',
                    }}
                    src={v.url}
                  />
                  {v.text}
                </div>
              </Option>
            );
          })}
        </Select>
      </Col>
      <Col span={15} offset={1}>
        <Input
          defaultValue={defaultValue.phone}
          placeholder={inputPh}
          maxLength={11}
          onChange={e => handleChange('input', e)}
        />
      </Col>
    </Row>
  );
};

registryPhone.defaultProps = {};

registryPhone.isFieldComponent = true;

export default registryPhone;
