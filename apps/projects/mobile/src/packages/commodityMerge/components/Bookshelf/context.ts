/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 11:22:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 11:22:09
 * @Description: 
 */
import React from 'react';

type BookshelfContextProps = {
  /**
   * label 宽度
   */
  labelWidth?: number | string,
}

const BookshelfContext = React.createContext<BookshelfContextProps | null>(null);

export const BookshelfContextProvider = BookshelfContext.Provider;

export default BookshelfContext;