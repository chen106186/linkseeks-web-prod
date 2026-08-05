/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 14:19:50
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-25 14:23:25
 * @Description: formily 商城多选框
 */
import React from 'react'
import { connect } from '@apps/formily'
import ApplicableList from '../../ApplicableList'

const FormilyApplicableList = connect()((props) => {
  const { dataSource, value, onChange } = props
  return <ApplicableList options={dataSource} value={value} onChange={onChange} />
})

export default FormilyApplicableList
