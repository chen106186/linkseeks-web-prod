/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-08 14:15:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 14:15:35
 * @Description: 
 */
import React from 'react';

type DescriptionsContextProps = {
  /**
   * 冒号
   */
  colon?: string,
  /**
   * Item 宽度
   */
  width?: string | number,
  /**
   * Item label 宽度
   */
  labelWidth?: string | number,
}

const DescriptionsContext = React.createContext<DescriptionsContextProps | null>(null);

export const DescriptionsContextProvider = DescriptionsContext.Provider;

export default DescriptionsContext;