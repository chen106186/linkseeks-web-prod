/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-05 17:08:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-05 18:06:08
 * @Description: 
 */
import React from 'react';
import { ButtonTabsItemProps } from './interface';
import ButtonTabsContext from './context';

const ButtonTabsItem: React.FC<ButtonTabsItemProps> = (props) => {
  const { activeKey, children, style, ...rest } = props;
  
  const context = React.useContext(ButtonTabsContext);

  return (
    <div
      {...rest}
      key={activeKey}
      style={{
        ...style,
        display: context.current === activeKey ? 'block' : 'none',
      }}
    >
      {children}
    </div>
  );
};

export default ButtonTabsItem;
