/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-31 16:24:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 11:43:41
 * @Description:
 */
import { useBusinessEffects } from './useBusinessEffects'
import { getMemberSupplierProcessRuleBaseList } from '@apps/apis'

export const createEffects = (context, actions) => {
  const { setFieldState } = actions

  useBusinessEffects(context, actions)

  // 查询入库流程、变更流程列表
  getMemberSupplierProcessRuleBaseList()
    .then((res) => {
      if (res.code === 1000) {
        setFieldState('depositoryProcessId', (state) => {
          state.props['x-component-props'].dataSource = res.data.filter((item) => item.processType === 1)
        })
        setFieldState('changedProcessId', (state) => {
          state.props['x-component-props'].dataSource = res.data.filter((item) => item.processType === 2)
        })
      }
    })
    .catch((err) => {
      console.warn(err)
    })
}
