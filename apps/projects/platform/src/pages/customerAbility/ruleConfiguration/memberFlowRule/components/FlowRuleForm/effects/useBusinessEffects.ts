/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-31 16:24:22
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-01 14:39:50
 * @Description:
 */
import { FormEffectHooks, FormPath, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { GlobalConfig } from '@/global/config'

const { onFieldValueChange$, onFieldInputChange$, onFormInit$ } = FormEffectHooks

export const useBusinessEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { setFieldState, setFieldValue } = actions

  // 适用会员联动 平台注册资料
  onFieldValueChange$('memberRole').subscribe((fieldState) => {
    const { value } = fieldState

    setFieldState('*(platformConfigTable,configIds)', (state) => {
      state.props['x-component-props'].roleId = value?.roleId || 0
    })
  })

  // 适用会员联动 平台注册资料
  onFieldInputChange$('memberRole').subscribe((fieldState) => {
    // 清空
    setFieldValue('configIds', [])
  })

  onFormInit$().subscribe(() => {
    // 【PAAS-站点管理】有勾选【SAAS多租户部署】，隐藏【平台注册资料】tab页
    if (GlobalConfig.global.siteInfo.enableMultiTenancy) {
      setFieldState('tabs', (state) => {
        state.props['x-component-props'].hiddenKeys = ['tab-3']
      })
    }
  })
}
