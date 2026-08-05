/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 17:00:21
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 17:12:57
 * @Description: 适用品类列表
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import ApplicableList, { ApplicableListProps } from '../ApplicableList'

export interface IProps extends Pick<ApplicableListProps, 'options' | 'value'> {}

const ApplicableCategories: React.FC<IProps> = (props) => {
  const { options = [], value = [], ...restProps } = props

  return (
    <MellowCard title="适用品类" {...restProps}>
      <ApplicableList options={options} value={value} disabled />
    </MellowCard>
  )
}

export default ApplicableCategories
