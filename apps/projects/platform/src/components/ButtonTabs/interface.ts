/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-05 17:06:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-05 17:06:57
 * @Description: 
 */
import { HTMLAttributes } from 'react';
import { ButtonSwitchProps } from '../ButtonSwitch';
import { MellowCardProps } from '../MellowCard';

export type KeyType = string | number;

export interface ButtonTabsItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * 标识
   */
  activeKey: KeyType,

  children?: React.ReactNode,
}

export interface ButtonTabsProps extends ButtonSwitchProps, Omit<MellowCardProps, 'extra' | 'onChange' | 'size'> {
  /**
   * 头部左侧自定义拓展
   */
  extra?: React.ReactNode,
  /**
   * 默认值
   */
  defaultValue?: KeyType,

  children?: React.ReactNode,

  /**
   * 是否有流转记录
   */
   circulationIcon?: boolean
   /**
    * 执行方法显示流转
    */
    onShowCirculation?: Function
}

export interface ButtonTabsContextProps {
  current: KeyType;
}