/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-08 13:43:01
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 13:43:01
 * @Description:
 */
import React from 'react'

type CellContextProps = {
  /**
   * 是否对调 title 与 value 的字体样式
   */
  transposition?: boolean
}

const CellContext = React.createContext<CellContextProps | null>(null)

export const CellContextProvider = CellContext.Provider

export default CellContext
