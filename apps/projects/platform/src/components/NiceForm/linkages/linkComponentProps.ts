/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-21 14:18:19
 * @Description:
 */
import { FormEffectHooks, useValueLinkageEffect } from '@apps/formily'

export const useLinkComponentProps = (scope) => {
  useValueLinkageEffect({
    type: 'value:componentProps',
    resolve: ({ origin, target }, { setFieldState, getFieldState }) => {
      console.log('xxx')
      getFieldState(origin, (state) => {
        const { componentProps = {} } = state
        setFieldState(target, (targetState) => {
          const extendsProps = targetState.props['x-component-props'] || {}
          targetState.props['x-component-props'] = {
            ...extendsProps,
            ...componentProps,
          }
        })
      })
    },
    reject: ({ target }, { setFieldState, getFieldState }) => {
      getFieldState(origin, (state) => {
        const { disComponentProps = {} } = state
        setFieldState(target, (targetState) => {
          const extendsProps = targetState.props['x-component-props'] || {}
          targetState.props['x-component-props'] = {
            ...extendsProps,
            ...disComponentProps,
          }
        })
      })
    },
    // 需收集所有传入的expressionScope数据, 否则无法获取到依赖监听
    scope,
  })
}
