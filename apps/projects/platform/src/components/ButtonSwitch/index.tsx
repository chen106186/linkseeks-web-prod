/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-12 11:04:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-13 10:46:22
 * @Description: 按钮切换器
 */
import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import styles from './index.less';

export interface OptionItem {
  /**
   * 名称
   */
  label: string,
  /**
   * 值
   */
  value: any,
}

export interface ButtonSwitchProps {
  /**
   * 数据
   */
  options: OptionItem[],
  /**
   * 按钮切换触发事件
   */
  onChange?: (value: any) => void,
  /**
   * 值
   */
  value?: any,
  /**
   * Radio.Group size
   */
  size?: SizeType,
}

const ButtonSwitch: React.FC<ButtonSwitchProps> = (props: ButtonSwitchProps) => {
  const {
    options,
    onChange,
    value,
    size,
  } = props;
  const first = options.length ? options[0].value : '';
  const [radioValue, setRadioValue] = useState(first);

  useEffect(() => {
    if ('value' in props) {
      setRadioValue(value);
    }
  }, [value]);

  const triggerChange = (next: any) => {
    if (onChange) {
      onChange(next);
    }
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    if (!('value' in props)) {
      setRadioValue(e.target.value);
      return;
    }
    triggerChange(e.target.value);
  };

  return (
    <div className={styles['button-switch']}>
      <Radio.Group
        options={options}
        onChange={handleRadioChange}
        value={radioValue}
        optionType="button"
        size={size}
      />
    </div>
  );
};

ButtonSwitch.defaultProps = {
  onChange: undefined,
  size: 'small',
};

export default ButtonSwitch;
