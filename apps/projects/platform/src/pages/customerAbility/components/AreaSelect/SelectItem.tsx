/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-10 14:30:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-10 15:29:04
 * @Description: 区域选择单个Select
 */
import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

interface IProps extends SelectProps<string> {
  /**
   * 选项
   */
  options: {
    /**
     * 描述
     */
    label: string,
    /**
     * 值
     */
    value: any,
  }[],
}

const AreaSelectItem = (props: IProps) => {
  const {
    disabled,
    value,
    options,
  } = props;

  const current = options.find((item) => item.value === value);

  if (!disabled) {
    return (
      <Select
        style={{
          width: '100%',
        }}
        {...props}
      >
        {options.map((item) => (
          <Select.Option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </Select.Option>
        ))}
      </Select>
    );
  }

  return (
    <div>{current?.label}</div>
  );
};

export default AreaSelectItem;
