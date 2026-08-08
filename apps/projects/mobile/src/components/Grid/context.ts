/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-08 14:32:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 14:32:52
 * @Description: 
 */
import React from 'react';

type GridContextProps = {
  /**
   * Item 宽度
   */
  width?: string | number,
  /**
   * 是否显示左边框
   */
  borderLeft?: boolean,
  /**
   * 是否显示上边框
   */
  borderTop?: boolean,
  /**
   * 外部容器自定义样式
   */
  style?: React.CSSProperties,
  /**
   * 边框样式
   */
  borderStyle?: 'solid' | 'dotted' | 'dashed',
}

const GridContext = React.createContext<GridContextProps | null>(null);

export const GridContextProvider = GridContext.Provider;

export default GridContext;