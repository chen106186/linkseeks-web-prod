/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 09:40:03
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 11:07:44
 * @Description: formily 豆腐多选框
 */
import React from 'react'
import { connect } from '@apps/formily'
import TofuCheckboxGroup from '../../TofuCheckboxGroup'

const FormilyTofuCheckboxGroup = connect()((props) => {
  const { dataSource, value, onChange, ...rest } = props
  return <TofuCheckboxGroup options={dataSource} value={value} onChange={onChange} {...rest} editable={rest.ediabled} />
})

export default FormilyTofuCheckboxGroup
