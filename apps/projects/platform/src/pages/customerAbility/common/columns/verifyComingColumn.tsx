/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 11:30:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 15:59:49
 * @Description: 审核入库相关公用 columns
 */
import React from 'react'
import { Badge } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import StatusTag from '@/components/StatusTag'
import styles from '../styles.less'

const intl = getIntl()

/**
 *
 * @param target string 会员详情路径前缀
 * @returns Table Columns
 */
const columns = (target = '/customerAbility/manage/memberPrSubmit/detail'): ColumnType<any>[] => [
  {
    title: `${intl.formatMessage({ id: 'customerAbility.management.common.columns.memberId' })}/${intl.formatMessage({
      id: 'customerAbility.management.common.columns.memberName',
    })}`,
    dataIndex: 'memberId',
    render: (text, record) => (
      <>
        <div>{text}</div>
        <EyeAuthButton url={`${target}?validateId=${record.validateId}`}>{record.name}</EyeAuthButton>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'customerAbility.management.common.columns.memberTypeName' }),
    dataIndex: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'customerAbility.management.common.columns.roleName' }),
    dataIndex: 'roleName',
  },
  {
    title: `${intl.formatMessage({ id: 'customerAbility.management.common.columns.sourceName' })}/${intl.formatMessage({
      id: 'customerAbility.management.common.columns.registerTime',
    })}`,
    dataIndex: 'sourceName',
    render: (text, record) => (
      <>
        <div>{text}</div>
        <div className={styles.description}>{record.registerTime}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'customerAbility.management.common.columns.outerStatusName' }),
    dataIndex: 'outerStatusName',
    render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
  },
  {
    title: intl.formatMessage({ id: 'customerAbility.management.common.columns.innerStatusName' }),
    dataIndex: 'innerStatusName',
    render: (text, record) => (
      <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
    ),
  },
]

export default columns
