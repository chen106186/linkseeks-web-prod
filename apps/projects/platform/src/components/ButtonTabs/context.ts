/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-05 17:30:25
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-05 17:30:25
 * @Description: 
 */
import * as React from 'react';
import { ButtonTabsContextProps } from './interface';

const ButtonTabsContext = React.createContext<ButtonTabsContextProps | null>(null);

export const ButtonTabsContextProvider = ButtonTabsContext.Provider;

export default ButtonTabsContext;