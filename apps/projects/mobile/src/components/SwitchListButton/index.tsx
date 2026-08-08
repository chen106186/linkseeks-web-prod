/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-11 15:27:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-04-22 18:19:05
 * @Description: 商品列表样式切换按钮
 */
import React from 'react';
import { Icons, View } from '@apps/mobile-ui';
import useSwitchListChange from './useSwitchListChange';
import './index.scss';

interface SwitchListButtonProps {
  /**
   * 类型，可选 default | larger
   */
  type: 'default' | 'larger';
  /**
   * 点击切换事件
   */
  onSwitch: () => void;
}

const TYPE_ARR = ['default', 'larger'];
const ICON_MAP = {
  default: 'appstore-o',
  larger: 'bars',
};

const SwitchListButton: React.FC<SwitchListButtonProps> = (props: SwitchListButtonProps) => {
  const { type, onSwitch } = props;

  const handleSwitch = () => {
    if (onSwitch) {
      onSwitch();
    }
  };

  return (
    <View
      className='swtichListBtn'
      onClick={handleSwitch}
    >
      <Icons
        name={ICON_MAP[type]}
        size={22}
        color='#303133'
      />
    </View>
  );
};

export {
  SwitchListButton as default,
  useSwitchListChange,
  TYPE_ARR,
};
