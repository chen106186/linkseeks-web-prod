/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 17:01:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 17:45:13
 * @Description: 适用品牌列表
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import ApplicableList, { ApplicableListProps } from '../ApplicableList'

export interface IProps extends Pick<ApplicableListProps, 'options' | 'value'> {}

const ApplicableCategories: React.FC<IProps> = (props) => {
  const { options = [], value = [], ...restProps } = props

  return (
    <MellowCard title="适用品牌" {...restProps}>
      <ApplicableList options={options} value={value} disabled />
    </MellowCard>
  )
}

export default ApplicableCategories
