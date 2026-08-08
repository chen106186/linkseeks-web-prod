import { useIntl } from '@linkseeks/i18n'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 13:43:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-08 15:50:49
 * @Description: formily 会员多选框
 */
import React from 'react'
import { connect } from '@apps/formily'
import MemberCheckboxGroup from '../../MemberCheckboxGroup'
import styles from './index.less'

const FormilyMemberCheckboxGroup = connect()((props) => {
  const { dataSource, value, onChange, ...rest } = props
  return (
    <div className={styles['formily-memberCheckbox']}>
      <MemberCheckboxGroup options={dataSource} value={value} onChange={onChange} {...rest} />
    </div>
  )
})

export default FormilyMemberCheckboxGroup
