/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-15 17:13:25
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-15 17:19:58
 * @Description: Radio.Button 选项卡
 */
import React, { useEffect, useState } from 'react';
import { ButtonTabsProps, KeyType } from './interface';
import { ButtonTabsContextProvider } from './context';
import ButtonSwitch from '../ButtonSwitch';
import MellowCard from '../MellowCard';
import { ClockCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const ButtonTabs: React.FC<ButtonTabsProps> = (props) => {
  const {
    options = [],
    onChange = undefined,
    value,
    size = 'small',
    extra,
    defaultValue,
    children,
    circulationIcon,
    onShowCirculation,
    ...rest
  } = props;
  const initValue = 'value' in props ? props.value : defaultValue;
  const [switchValue, setSwitchValue] = useState<KeyType>(initValue);

  useEffect(() => {
    if ('value' in props) {
      setSwitchValue(value);
    }
  }, [value]);

  const triggerChange = (next: KeyType) => {
    if (onChange) {
      onChange(next);
    }
  };

  const handleButtonSwitchChange = (next: KeyType) => {
    if (!('value' in props)) {
      setSwitchValue(next);
    }
    triggerChange(next);
  };

  return (
    <MellowCard
      title={extra}
      extra={(
        <div className={styles.btn_witch_warp}>
          {
            circulationIcon && <ClockCircleOutlined  className={styles.icon} onClick={()=>onShowCirculation()}/>
          }
          <ButtonSwitch
            options={options}
            onChange={handleButtonSwitchChange}
            value={switchValue}
            size={size}
          />
        </div>
      )}
      {...rest}
    >
      <ButtonTabsContextProvider
        value={{
          current: switchValue,
        }}
      >
        {children}
      </ButtonTabsContextProvider>
    </MellowCard>
  );
};

export default ButtonTabs;
