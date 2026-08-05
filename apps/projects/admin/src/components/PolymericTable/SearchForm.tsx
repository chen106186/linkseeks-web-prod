/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-14 14:54:38
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 16:30:16
 * @Description: 查询 Form
 */
import React from 'react'
import { createFormActions } from '@apps/formily'
import type { IAntdSchemaFormProps } from '@apps/formily'
import NiceForm from '@/components/NiceForm'

const formActions = createFormActions()

export interface SearchFormIProps extends IAntdSchemaFormProps {}

const SearchForm: React.FC<SearchFormIProps> = (props) => {
  const { ...restProps } = props

  return <NiceForm effects={($, {}) => {}} actions={formActions} {...restProps} />
}

export default SearchForm
