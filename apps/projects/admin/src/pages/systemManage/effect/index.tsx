import React, { useEffect } from 'react'
import { ISchemaFormActions, FormEffectHooks, IFormActions } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getProductSelectGetSelectCategory } from '@apps/apis'
const { onFieldValueChange$ } = FormEffectHooks

// 高级筛选schema中用于输入搜索需求发布品类的Effect
export const searchSelectGetSelectCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectCategory({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
