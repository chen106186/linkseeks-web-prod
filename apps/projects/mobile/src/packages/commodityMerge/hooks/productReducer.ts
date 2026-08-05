/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-26 19:51:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-15 18:06:49
 * @Description: 商品信息 reducer
 */
import { Reducer } from 'react';
import { ProductInfoType } from '../components/SkuPopup';

export const initialState: ProductInfoType = {
  id: 0,
  name: '',
  min: 0,
  max: 0,
  unitName: '',
  mainPic: '',
  minOrder: 0,
  aboutPrice: 0,
  subUnitName: '',
}

type ReducerActionType = {
  /**
   * 类型
   */
  type: string,
  /**
   * 额外的参数
   */
  payload: Partial<ProductInfoType>,
}

export const reducer: Reducer<ProductInfoType, ReducerActionType> = (state: ProductInfoType, action: ReducerActionType) => {
  switch (action.type) {
    case 'setProductMiniInfo':
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
}
