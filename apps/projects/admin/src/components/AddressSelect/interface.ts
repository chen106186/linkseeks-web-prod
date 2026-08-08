/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-06 09:51:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-06 09:51:16
 * @Description:
 */
import { AddressValueType } from './components/AddressRadioGroup'

export interface AddressSelectContextProps {
  /**
   * 地址列表
   */
  addressList: AddressValueType[]
  /**
   * 重新加载列表
   */
  refresh: (actionFlag?: boolean) => void
}
