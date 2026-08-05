/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 09:58:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 17:44:13
 * @Description: 适用商城列表
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import ApplicableList, { ApplicableListProps } from '../../../components/ApplicableList'
import { useIntl } from '@linkseeks/i18n'

export interface IProps extends Pick<ApplicableListProps, 'options' | 'value'> {}

const ApplicableShopList: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { options = [], value = [], ...restProps } = props

  return (
    <MellowCard title={intl.formatMessage({ id: 'merchantCoupon.suitMall' })} {...restProps}>
      <ApplicableList options={options} value={value} disabled />
    </MellowCard>
  )
}

export default ApplicableShopList
