/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 10:22:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 16:04:02
 * @Description:
 */
import React from 'react'
import { Badge } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import StatusTag from '@/components/StatusTag'

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
        <EyeAuthButton url={`${target}?id=${record.memberId}&validateId=${record.validateId}`}>
          {record.name}
        </EyeAuthButton>
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
    title: intl.formatMessage({ id: 'customerAbility.management.common.columns.outerStatusName' }),
    dataIndex: 'outerStatusName',
    render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
  },
  {
    title: intl.formatMessage({ id: 'customerAbility.management.common.columns.innerStatusName' }),
    dataIndex: 'innerStatusName',
    render: (text, record) => <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus]} text={text} />,
  },
]

export default columns
