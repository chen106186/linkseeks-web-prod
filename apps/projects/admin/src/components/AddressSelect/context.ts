/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-06 09:50:59
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-06 09:53:00
 * @Description:
 */
import * as React from 'react'
import { AddressSelectContextProps } from './interface'

const AddressSelectContext = React.createContext<AddressSelectContextProps | null>(null)

export const AddressSelectContextProvider = AddressSelectContext.Provider

export default AddressSelectContext
