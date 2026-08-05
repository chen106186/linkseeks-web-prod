/**
 * @Description 会员注册省市区选择组件
 */
import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import {
  getMemberAreaProvince,
  getMemberAreaCity,
  getMemberAreaDistrict,
  GetMemberAreaProvinceResponse,
} from '@apps/apis';

type CascaderType = React.ComponentProps<typeof Cascader>

const API_MAP = {
  0: getMemberAreaProvince,
  1: getMemberAreaCity,
  2: getMemberAreaDistrict,
};

function normalizeOptions(dataSource: GetMemberAreaProvinceResponse, last = false): CascaderType['options'] {
  return dataSource.map((item) => ({ label: item.name, value: item.code, isLeaf: last }));
};

const MemberRegisterAreaFileds = (props) => {
  const {
    value,
    mutators,
    editable,
  } = props;

  const [internalValue, setInternalValue] = useState<React.Key[]>([]);
  const [options, setOptions] = useState<CascaderType['options']>([]);

  const fetchAreaProvince = () => {
    API_MAP[0]().then((res) => {
      if (res.code === 1000) {
        setOptions(normalizeOptions(res.data));
      }
    });
  };

  useEffect(() => {
    if (('value' in props) && {}) {
      const { provinceCode, cityCode, districtCode } = value || {};
      setInternalValue([provinceCode, cityCode, districtCode].filter(Boolean));
    }
  }, [value]);

  useEffect(() => {
    fetchAreaProvince();
  }, []);

  const handleChange = (next: React.Key[]) => {
    const [provinceCode, cityCode, districtCode] = next || [];
    mutators.change({
      provinceCode,
      cityCode,
      districtCode,
    });
  };

  const loadData: CascaderType['loadData'] = async (selectOptions) => {
    const targetOption = selectOptions[selectOptions.length - 1];

    try {
      targetOption.loading = true;
      const res = await API_MAP[selectOptions.length]({
        code: targetOption.value,
      });
      if (res.code === 1000) {
        targetOption.children = normalizeOptions(res.data, selectOptions.length === 2) as any;
        setOptions([...options]);
      }
    } catch (error) {

    } finally {
      targetOption.loading = false;
    }
  };

  return (
    <Cascader
      disabled={!editable}
      {...(props.props['x-component-props'] || {})}
      value={internalValue}
      onChange={handleChange}
      options={options}
      loadData={loadData}
      changeOnSelect
    />
  );
};

MemberRegisterAreaFileds.isFieldComponent = true;

export default MemberRegisterAreaFileds;
