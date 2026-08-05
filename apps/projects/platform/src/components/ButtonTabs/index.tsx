/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-05 17:10:21
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-05 17:10:21
 * @Description: 
 */
import * as React from 'react';
import InternalButtonTabs from './ButtonTabs';
import Item from './ButtonTabsItem';
import {
  ButtonTabsProps,
} from './interface';

export * from './interface';

interface CompoundedComponent extends React.ForwardRefExoticComponent<ButtonTabsProps> {
  Item: typeof Item;
}

const ButtonTabs = InternalButtonTabs as CompoundedComponent;
ButtonTabs.Item = Item;
export {
  Item,
};
export default ButtonTabs;